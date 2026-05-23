require('dotenv').config();

const express = require('express');
const cors = require('cors');

const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());

app.use(cors());

app.options(/(.*)/, cors());

const users = [];

app.get(`/`, (_, res) => {
  res.send('API rodando!');
});

app.post(`/register`, (req, res) => {
  const { email, password } = req.body;

  const userExists = users.find(u => u.email === email);

  if (userExists) {
    return res.status(400).json({message: 'Usuário já existe.'});
  }

  const user = { email, password };
  
  users.push(user);

  res.status(201).json({message: 'User registered successfully.'});
});

app.post(`/login`, (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.json({ token });
  }

  res.status(401).json({message: 'Credenciais inválidas.'});
});

const autenticarJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(403).send('Token não fornecido.');
  }

  try {
    const dados = jwt.verify(token, process.env.JWT_SECRET);

    req.user = dados;

    next();

  } catch {
    res.status(403).send('Token inválido.');
  }
};

app.get(`/musicas`, autenticarJWT, (req, res) => {
  res.json([
    { id: 1, titulo: 'Música A', artista: 'DJ A' },
    { id: 2, titulo: 'Música B', artista: 'DJ B' },
  ]);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
