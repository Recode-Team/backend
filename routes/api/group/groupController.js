const express = require("express");
const sequelize = require("../../../models/index");
const verifyToken = require("../../../token/verifyToken");

const router = express.Router();

// 그룹 생성 API
router.post("/", verifyToken, async (req, res) => {
  try {
    const { name, comment, creator } = req.body;
    const group = await sequelize.group.create({
      name,
      comment,
      creator
    });
    res.status(200).json(group);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to create group" });
  }
});

// 그룹 조회 API
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const groupId = req.params.id;
    const group = await sequelize.group.findOne({
      where: {
        id: groupId
      }
    });
    if (!group) {
      res.status(404).json({ error: "Group not found" });
    } else {
      res.status(200).json(group);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch group" });
  }
});

// 그룹 수정 API
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const groupId = req.params.id;
    const { name, comment, creator } = req.body;

    const updatedGroup = await sequelize.group.update(
      {
        name,
        comment,
        creator
      },
      {
        where: {
          id: groupId
        }
      }
    );

    if (updatedGroup[0] === 0) {
      res.status(404).json({ error: "Group not found" });
    } else {
      res.status(200).json({ message: "Group updated successfully" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to update group" });
  }
});

// 그룹 삭제 API
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const groupId = req.params.id;
    const deletedGroup = await sequelize.group.destroy({
      where: {
        id: groupId
      }
    });
    if (deletedGroup === 0) {
      res.status(404).json({ error: "Group not found" });
    } else {
      res.status(200).json({ message: "Group deleted successfully" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to delete group" });
  }
});

module.exports = router;