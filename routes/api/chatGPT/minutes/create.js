const express = require('express');
const fetch = require('node-fetch');
const speech = require('@google-cloud/speech');
const multer = require('multer');
const sequelize = require("../../../../models/index");
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
    res.status(500).send('오디오 파일 업로드에 실패했습니다.');
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
    // const [response] = await client.recognize(requestOptions);
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');

    // console.log("stt 변환: ");
    // console.log(transcription);

    // OpenAI GPT-3 API를 사용하여 회의록 생성
    const prompt = `${transcription}\n\n요약:\n\n`; // GPT에 입력할 문장
    const requestBody = { // GPT에 문장 전송
      prompt: prompt,
      max_tokens: 1024,
      temperature: 0.5,
      n: 1,
      stop: '\n\n',
    };
    const gptResponse = await fetch(`https://api.openai.com/v1/engines/${engine}/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${gptApiKey}`,
      },
      body: JSON.stringify(requestBody),
    });
    const json = await gptResponse.json();
    const summary = json.choices[0].text;

    const dresult = await sequelize.minutes.create(
      {transcription : transcription, summary : summary})
    .catch(err => {
        console.error(err)
    })
    if (dresult == undefined){
      res.status(409).send({'status' : "conflict"});
    }
    else {
      res.send({"result" : {"transcription" : transcription, "summary" : summary}});
    }
  });

  fileStream.write(audioFile);
  fileStream.end();

});


module.exports = router;