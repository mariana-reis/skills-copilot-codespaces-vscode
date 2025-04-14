// create web server
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Comment = require('./models/comment');
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 5000;
// port 
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    }
);
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/comments';
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
};
// connect to mongodb
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB', err);
  });
// middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// routes
app.get('/', (req, res) => {
  res.send('Hello World');
});
app.get('/comments', async (req, res) => {
  try {
    const comments = await Comment.find();
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.post('/comments', async (req, res) => {
  const comment = new Comment({
    name: req.body.name,
    comment: req.body.comment,
  });
  try {
    const newComment = await comment.save();
    res.status(201).json(newComment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});