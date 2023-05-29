// Recode\Backend\routes\api\chatGPT\minutes\update.js
const express = require('express');
const { minutes } = require("../../../../models");
const router = express.Router();

// Get all meeting minutes
router.get('/api/meeting-minutes', async(req, res) => {
  try {
    const allMinutes = await minutes.findAll();
    
    if (allMinutes.length === 0) {
      // No minutes found
      res.status(404).json({
        status: 'not found',
        results: { target: 'minutes' },
      });
    } else {
      // Minutes found
      res.status(200).json({
        status: 'ok',
        results: { minutes: allMinutes },
      });
    }
  } catch (error) {
    // Error handling
    console.error('Failed to fetch meeting minutes:', error);
    res.status(500).json({
      status: 'error',
      error: 'Failed to fetch meeting minutes',
    });
  }
});

// Get meeting details by ID
router.get('/api/meeting-minutes/:id', async(req, res) => {
  try {
    const { id } = req.params;
    let meeting =  await minutes.findOne({
      // attributes: ['email'],
          where: {
              id: parseInt(id)
          }
      })
      .catch( err => {
          console.log(err)
      })
  
    if (meeting) {
      const { id, title, transcription, summary, createdAt, updatedAt } = meeting;
      const formattedMeeting = {
        id: id,
        title: title,
        transcription: transcription,
        summary: summary,
        createdAt: createdAt,
        updatedAt: updatedAt
      };

      res.status(200).json({
        status: 'ok',
        results: { minutes: formattedMeeting },
      });
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error('Failed to get meeting details:', error);
    res.sendStatus(500);
  }
});



// Update meeting minute by ID
router.put('/api/meeting-minutes/:id', async (req, res) => {
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
    console.error('Failed to update meeting minute:', error);
    res.sendStatus(500);
  }
});


module.exports = router;