const express = require("express");
const fetch = require("node-fetch");
const speech = require("@google-cloud/speech");
const multer = require("multer");
const { minutes } = require("../../../models");
const verifyToken = require("../../../token/verifyToken");
const { Sequelize } = require("sequelize");
const upload = multer();

// GPT API key
const gptApiKey = process.env.GPT_API;
const engine = "text-davinci-003";

// Google Cloud Speech-to-Text API
const client = new speech.SpeechClient();
const authFilePath = "./routes/api/minutes/googleAuth.json";
process.env.GOOGLE_APPLICATION_CREDENTIALS = authFilePath;

const router = express.Router();

// create
router.post(
  "/:id",
  verifyToken,
  upload.single("audioFile"),
  async (req, res) => {
    const audioFile = req.file.buffer;
    const filename = req.file.originalname;
    const boardId = req.params.id;

    // Google Cloud Storage bucket setting
    const { Storage } = require("@google-cloud/storage");
    const storage = new Storage();
    const bucketName = "minutes-2023";

    // bucket file path
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(filename);
    const fileStream = file.createWriteStream({
      metadata: {
        contentType: "audio/mpeg",
      },
    });
    fileStream.on("error", (err) => {
      console.error(err);
      res
        .status(500)
        .send({ result: undefined, state: "오디오 파일을 찾지 못했습니다." });
    });
    fileStream.on("finish", async () => {
      console.log(`오디오 파일 ${filename} 업로드에 성공했습니다.`);

      // Speech To Text Options
      const requestOptions = {
        config: {
          encoding: "MP3",
          sampleRateHertz: 48000,
          languageCode: "ko-KR",
          enableWordTimeOffsets: true,
        },
        audio: {
          uri: `gs://${bucketName}/${filename}`,
        },
      };

      // long audio file Speech To Text
      const [operation] = await client.longRunningRecognize(requestOptions);
      const [speechText] = await operation.promise();

      const speechTranscription = speechText.results
        .map((result) => result.alternatives[0].transcript)
        .join("\n");

      // summary
      const summaryPrompt = `${speechTranscription}\n\n짧게 끊어서 중요한 요점이나 요약 문장을 나열 (Markdown 언어로 표현) : \n\n\n\n`;
      const summaryResponse = await fetch(
        `https://api.openai.com/v1/engines/${engine}/completions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${gptApiKey}`,
          },
          body: JSON.stringify({
            prompt: summaryPrompt,
            max_tokens: 1024,
            temperature: 0.5,
            n: 1,
            stop: "\n\n\n\n",
          }),
        }
      ).catch((err) => {
        console.log(err);
      });
      const summaryJson = await summaryResponse.json();
      const summary = await summaryJson.choices[0].text;

      // title
      const tilePrompt = `${summary}\n 회의 제목 (회의 내용과 동일한 언어로 작성, 15byte 이내) : \n`;
      const titleResponse = await fetch(
        `https://api.openai.com/v1/engines/${engine}/completions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${gptApiKey}`,
          },
          body: JSON.stringify({
            prompt: tilePrompt,
            max_tokens: 1024,
            temperature: 0.5,
            n: 1,
            stop: "\n\n",
          }),
        }
      ).catch((err) => {
        console.log(err);
      });

      const titleJson = await titleResponse.json();
      console.log(titleJson);
      const title = await titleJson.choices[0].text;

      const groupId = await Sequelize.board.findOne({
        where: { id: boardId },
      });

      const dresult = await minutes
        .create({
          group_id: groupId,
          transcription: speechTranscription,
          summary: summary,
          title: title,
        })
        .catch((err) => {
          console.error(err);
        });

      if (dresult == undefined) {
        res.status(409).send({ status: "conflict" });
      } else {
        res.send({
          result: {
            transcription: speechTranscription,
            summary: summary,
            title: title,
          },
        });
      }
    });

    fileStream.write(audioFile);
    fileStream.end();
  }
);

// read all
router.get("/", verifyToken, async (req, res) => {
  try {
    const allMinutes = await minutes.findAll();

    if (allMinutes.length === 0) {
      // No minutes found
      res.status(404).json({
        status: "not found",
        results: { target: "minutes" },
      });
    } else {
      // Minutes found
      res.status(200).json({
        status: "ok",
        results: { minutes: allMinutes },
      });
    }
  } catch (error) {
    // Error handling
    console.error("Failed to fetch meeting minutes:", error);
    res.status(500).json({
      status: "error",
      error: "Failed to fetch meeting minutes",
    });
  }
});

// read
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    let meeting = await minutes
      .findOne({
        // attributes: ['email'],
        where: {
          id: parseInt(id),
        },
      })
      .catch((err) => {
        console.log(err);
      });

    if (meeting) {
      const { id, title, transcription, summary, createdAt, updatedAt } =
        meeting;
      const formattedMeeting = {
        id: id,
        title: title,
        transcription: transcription,
        summary: summary,
        createdAt: createdAt,
        updatedAt: updatedAt,
      };

      res.status(200).json({
        status: "ok",
        results: { minutes: formattedMeeting },
      });
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error("Failed to get meeting details:", error);
    res.sendStatus(500);
  }
});

// update
router.put("/:id", verifyToken, async (req, res) => {
  try {
    let { id } = req.params;
    const { minute } = req.body;
    id = parseInt(id);

    const updatedMeeting = await minutes.update(
      { summary: minute }, // 업데이트할 필드와 값
      { where: { id: id } } // 업데이트 대상 조건
    );

    if (updatedMeeting[0] === 1) {
      // 업데이트 성공
      res.sendStatus(200);
    } else {
      // 업데이트 실패 - 해당 ID의 모임이 존재하지 않음
      res.sendStatus(404);
    }
  } catch (error) {
    console.error("Failed to update meeting minute:", error);
    res.sendStatus(500);
  }
});

module.exports = router;
