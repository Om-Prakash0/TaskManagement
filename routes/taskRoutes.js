
const express = require('express');
const router = express.Router();

let tasks = [
  {
    taskId: 1,
    taskName: "Complete DSA",
    limit: "2 hours",
    status: "pending"
  },
  {
    taskId: 2,
    taskName: "Learn Express",
    limit: "1 hour",
    status: "completed"
  },
  {
    taskId: 3,
    taskName: "Build a project",
    limit: "3 hours",
    status: "pending"
  }
];

// GET all tasks
router.get('/', (req, res) => {
  res.status(200).json(tasks);
});

// GET one task
router.get('/:taskId', (req, res) => {
  const id = Number(req.params.taskId);

  const task = tasks.find(task => task.taskId === id);

  if (!task) {
    return res.status(404).json({
      message: "Task not found"
    });
  }

  res.status(200).json(task);
});

// CREATE a task
router.post('/create', (req, res) => {
  const { taskName, limit, status } = req.body;

  if (!taskName || !limit || !status) {
    return res.status(400).json({
      message: "All fields are required"
    });
  }

  if (!["pending", "completed"].includes(status)) {
    return res.status(400).json({
      message: "Status must be pending or completed"
    });
  }

  const newTask = {
    taskId: tasks.length > 0
      ? Math.max(...tasks.map(task => task.taskId)) + 1
      : 1,
    taskName,
    limit,
    status
  };

  tasks.push(newTask);

  res.status(201).json({
    message: "Task created successfully",
    task: newTask
  });
});

// DELETE a task
router.delete('/:taskId', (req, res) => {
  const id = Number(req.params.taskId);

  const index = tasks.findIndex(task => task.taskId === id);

  if (index === -1) {
    return res.status(404).json({
      message: "Task not found"
    });
  }

  const deletedTask = tasks.splice(index, 1)[0];

  res.status(200).json({
    message: "Task deleted successfully",
    task: deletedTask
  });
});

module.exports = router;
