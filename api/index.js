const express = require('express');
const app = express();
app.use(express.json());

let users = [];
let tasks = [];
let userIdCounter = 1;
let taskIdCounter = 1;

// ===== Usuários =====

app.get('/api/users', (req, res) => {
  res.json(users);
});

app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  const newUser = { id: userIdCounter++, name, email };
  users.push(newUser);
  res.status(201).json(newUser);
});

app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id == req.params.id);
  user ? res.json(user) : res.status(404).send('Usuário não encontrado');
});

app.put('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id == req.params.id);
  if (user) {
    const { name, email } = req.body;
    user.name = name ?? user.name;
    user.email = email ?? user.email;
    res.json(user);
  } else {
    res.status(404).send('Usuário não encontrado');
  }
});

app.delete('/api/users/:id', (req, res) => {
  users = users.filter(u => u.id != req.params.id);
  res.status(204).end();
});

// ===== Tarefas (Agenda) =====

app.get('/api/users/:userId/tasks', (req, res) => {
  const userTasks = tasks.filter(t => t.userId == req.params.userId);
  res.json(userTasks);
});

app.post('/api/users/:userId/tasks', (req, res) => {
  const { title, date } = req.body;
  const user = users.find(u => u.id == req.params.userId);
  if (!user) return res.status(404).send('Usuário não encontrado');

  const newTask = { id: taskIdCounter++, userId: user.id, title, date };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.put('/api/users/:userId/tasks/:taskId', (req, res) => {
  const task = tasks.find(t => t.id == req.params.taskId && t.userId == req.params.userId);
  if (!task) return res.status(404).send('Tarefa não encontrada');

  const { title, date } = req.body;
  task.title = title ?? task.title;
  task.date = date ?? task.date;
  res.json(task);
});

app.delete('/api/users/:userId/tasks/:taskId', (req, res) => {
  tasks = tasks.filter(t => !(t.id == req.params.taskId && t.userId == req.params.userId));
  res.status(204).end();
});

// Vercel exige exportação do app como handler
module.exports = app;
