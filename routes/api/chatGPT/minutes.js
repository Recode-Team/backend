const express = require('express');
const axios = require('axios');
const { Configuration, OpenAIApi } = require("openai")
const { GPT_API } = process.env;

const configuration = new Configuration({
  apiKey: GPT_API,
});
const openai = new OpenAIApi(configuration);
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const meetingData = req.body;
    const title = meetingData.title;
    const date = new Date(meetingData.date).toLocaleString();
    const place = meetingData.place;
    const attendees = meetingData.attendees;
    const conversation = meetingData.conversation;

    let minutes = '아래글을 대화내용을 바탕으로 대화 내용 요약을 사용해서 회의록을 작성해줘\n';
    minutes += `회의록 제목: ${title}\n`;
    minutes += `일시: ${date}\n`;
    minutes += `장소: ${place}\n`;
    minutes += `참석자: ${attendees.join(', ')}\n`;

    for (const [speaker, conversationList] of Object.entries(conversation)) {
      minutes += `${speaker}\n`;
      for (const item of conversationList) {
        const time = new Date(item.time);
        const formattedTime = `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
        minutes += `${formattedTime} ${speaker} : ${item.text}\n`;
      }

      minutes += '\n';
    }

    console.log(minutes)
    response = await openai.createCompletion({
        model:"text-davinci-003",
        prompt: minutes,
        temperature: 0.7,
        max_tokens: 500,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
  });

    const { text } = response.data.choices[0];

    // 응답 정보를 클라이언트로 전달합니다.
    res.json({
      result: text
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      message: 'Failed to generate meeting minutes',
      error: err.message
    });
  }
});

module.exports = router;