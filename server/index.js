const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

app.use(cors({ 
  origin: [
    'http://localhost:5173',
    'https://ai-resume-analyzer-phi-lilac.vercel.app'
  ]
}));
app.use(helmet());
app.use(express.json());

app.use('/api/resume', require('./routes/resume'));

app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
