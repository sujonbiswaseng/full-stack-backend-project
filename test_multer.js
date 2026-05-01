const express = require('express');
const multer = require('multer');
const request = require('supertest');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.array('file'), (req, res) => {
  res.json({ files: req.files, body: req.body });
});

app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

request(app)
  .post('/upload')
  .attach('images', Buffer.from('test'), 'test.jpg')
  .end((err, res) => {
    console.log(res.body);
  });
