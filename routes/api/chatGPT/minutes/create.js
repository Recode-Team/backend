const express = require('express');
const fetch = require('node-fetch');
const speech = require('@google-cloud/speech');
const multer = require('multer');
const { minutes } = require("../../../../models");
const upload = multer();

const router = express.Router();

// API key 및 인증 정보 설정
const gptApiKey = process.env.GPT_API;
const authFilePath = './routes/api/chatGPT/minutes/googleAuth.json';
process.env.GOOGLE_APPLICATION_CREDENTIALS = authFilePath;

// Google Cloud Speech-to-Text API 설정
const client = new speech.SpeechClient();

// ChatGPT API 설정
const engine = 'text-davinci-003';

// 회의록 생성
router.post('/', upload.single('audioFile'), async (req, res) => {
  const audioFile = req.file.buffer;
  const filename = req.file.originalname;

  // Google Cloud Storage 버킷 생성
  const {Storage} = require('@google-cloud/storage');
  const storage = new Storage();
  const BUCKET_NAME = 'minutes-bucket';

  // 버킷에 오디오 파일 업로드
  const bucket = storage.bucket(BUCKET_NAME);
  const file = bucket.file(filename);
  const fileStream = file.createWriteStream({
    metadata: {
      contentType: 'audio/mpeg',
    },
  });

  fileStream.on('error', err => {
    console.error(err);
    res.status(500).send({"result" : undefined, "state": "오디오 파일을 찾지 못했습니다."});
  });

  fileStream.on('finish', async () => {
    console.log(`오디오 파일 ${filename} 업로드에 성공했습니다.`);

    // Google Cloud Speech-to-Text API를 사용하여 음성 파일을 텍스트로 변환
    const requestOptions = {
      config: {
        encoding: 'MP3',
        sampleRateHertz: 48000,
        languageCode: 'ko-KR',
        enableWordTimeOffsets: true,
      },
      audio: {
        uri: `gs://${BUCKET_NAME}/${filename}`,
      },
    };
    // 오디오 긴 파일
    const [operation] = await client.longRunningRecognize(requestOptions);
    const [response] = await operation.promise();
    
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');

    // OpenAI GPT-3 API를 사용하여 회의록 생성
    const prompt = `${transcription}\n\n짧게 끊어서 중요한 요점이나 요약 문장을 나열 (Markdown 언어로 표현) : \n\n\n\n`; 
    const requestBody = { 
      prompt: prompt,
      max_tokens: 1024,
      temperature: 0.5,
      n: 1,
      stop: '\n\n\n\n',
    };

    const gptResponse = await fetch(`https://api.openai.com/v1/engines/${engine}/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${gptApiKey}`,
      },
      body: JSON.stringify(requestBody),
    })
    .catch( err => {
      console.log(err)
    })
    const json = await gptResponse.json();
    const summary = await json.choices[0].text;

    tilePrompt = `${summary}\n 회의 제목 (회의 내용과 동일한 언어로 작성, 15byte 이내) : \n`
    const titleRequestBody = { 
      prompt: tilePrompt,
      max_tokens: 1024,
      temperature: 0.5,
      n: 1,
      stop: '\n\n',
    };


    // 회의 제목 (회의 내용과 동일한 언어로 작성) : 
    const gptTitle = await fetch(`https://api.openai.com/v1/engines/${engine}/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${gptApiKey}`,
      },
      body: JSON.stringify(titleRequestBody),
    })
    .catch( err => {
      console.log(err)
    })
  
    const jsonTitle = await gptTitle.json();
    console.log(jsonTitle)
    const titleSummary = await jsonTitle.choices[0].text;

    const dresult = await minutes.create(
      {transcription : transcription, summary : summary, title: titleSummary})
    .catch(err => {
        console.error(err)
    })

    if (dresult == undefined){
      res.status(409).send({'status' : "conflict"});
    }
    else {
      res.send({"result" : {"transcription" : transcription, "summary" : summary, "title": titleSummary}});
    }
  });

  fileStream.write(audioFile);
  fileStream.end();

});


module.exports = router;