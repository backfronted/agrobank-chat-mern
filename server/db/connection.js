const mongoose = require('mongoose')
// const url = 'mongodb://localhost:27017/ChatApp'

mongoose
  .connect(
    'mongodb://127.0.0.1:27017/ChatApp',
    { useNewUrlParser: true },
    { useUnifiedTopology: true }
  )
  .then(() => console.log('Connected to DB'))
  .catch((e) => console.log('Error', e))
