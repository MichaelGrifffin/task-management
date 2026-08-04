const express = require('express');
const { dbRun, dbGet, dbAll } = require('../db');
const { authenticateToken } = require('../middleware/auth');
const { broadcast } = require('../websocket');

const router = express.Router();

// Apply auth middleware to all task routes
router.use(authenticateToken);

// GET /api/tasks (with filter/search support)
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, priority, search } = req.query;

    let query = 'SELECT * FROM tasks WHERE user_id = ?';
    const params = [userId];

    if (status && status !== 'all') {
      query += ' AND status = ?';
      params.push(status);
    }

    if (priority && priority !== 'all') {
      query += ' AND priority = ?';
      params.push(priority);
    }

    if (search) {
      query += ' AND (title LIKE ? OR description LIKE ? OR tags LIKE ?)';
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    query += ' ORDER BY CASE status WHEN "in_progress" THEN 1 WHEN "todo" THEN 2 WHEN "completed" THEN 3 END, created_at DESC';

    const tasks = await dbAll(query, params);
    res.json({ tasks });
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ error: 'Failed to retrieve tasks' });
  }
});

// GET /api/tasks/:id
router.get('/:id', async (req, res) => {
  try {
    const task = await dbGet('SELECT * FROM tasks WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ task });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch task details' });
  }
});

// POST /api/tasks (Create task)
router.post('/', async (req, res) => {
  try {
    const { title, description, status = 'todo', priority = 'medium', due_date, tags = '' } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Task title is required' });
    }

    const result = await dbRun(
      `INSERT INTO tasks (user_id, title, description, status, priority, due_date, tags) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, title.trim(), description || '', status, priority, due_date || null, tags || '']
    );

    const newTask = await dbGet('SELECT * FROM tasks WHERE id = ?', [result.id]);

    // Broadcast real-time WebSocket update
    broadcast({
      type: 'TASK_CREATED',
      userId: req.user.id,
      task: newTask
    });

    res.status(201).json({ message: 'Task created successfully', task: newTask });
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// PUT /api/tasks/:id (Update task)
router.put('/:id', async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.id;

    const existingTask = await dbGet('SELECT * FROM tasks WHERE id = ? AND user_id = ?', [taskId, userId]);
    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found or unauthorized' });
    }

    const { title, description, status, priority, due_date, tags } = req.body;

    const updatedTitle = title !== undefined ? title.trim() : existingTask.title;
    const updatedDesc = description !== undefined ? description : existingTask.description;
    const updatedStatus = status !== undefined ? status : existingTask.status;
    const updatedPriority = priority !== undefined ? priority : existingTask.priority;
    const updatedDueDate = due_date !== undefined ? due_date : existingTask.due_date;
    const updatedTags = tags !== undefined ? tags : existingTask.tags;

    await dbRun(
      `UPDATE tasks SET 
        title = ?, 
        description = ?, 
        status = ?, 
        priority = ?, 
        due_date = ?, 
        tags = ?,
        updated_at = CURRENT_TIMESTAMP
       WHERE id = ? AND user_id = ?`,
      [updatedTitle, updatedDesc, updatedStatus, updatedPriority, updatedDueDate, updatedTags, taskId, userId]
    );

    const updatedTask = await dbGet('SELECT * FROM tasks WHERE id = ?', [taskId]);

    // Broadcast real-time WebSocket update
    broadcast({
      type: 'TASK_UPDATED',
      userId: req.user.id,
      task: updatedTask
    });

    res.json({ message: 'Task updated successfully', task: updatedTask });
  } catch (err) {
    console.error('Error updating task:', err);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// DELETE /api/tasks/:id (Delete task)
router.delete('/:id', async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.id;

    const existingTask = await dbGet('SELECT * FROM tasks WHERE id = ? AND user_id = ?', [taskId, userId]);
    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found or unauthorized' });
    }

    await dbRun('DELETE FROM tasks WHERE id = ? AND user_id = ?', [taskId, userId]);

    // Broadcast real-time WebSocket update
    broadcast({
      type: 'TASK_DELETED',
      userId: req.user.id,
      taskId: Number(taskId)
    });

    res.json({ message: 'Task deleted successfully', taskId: Number(taskId) });
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

module.exports = router;
