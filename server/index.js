require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const authRoute = require('./routes/auth');
const postRoute = require('./routes/post');
const cors = require('cors');


const connectDB  = async() => {
    try {
        await mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.b6kxv.mongodb.net/mern-learnit?retryWrites=true&w=majority`,  { useCreateIndex: true, useNewUrlParser: true, useFindAndModify: false , useUnifiedTopology : true});

        console.log('MongoDb connected');
    }
    catch(error){
        console.log(error.message);
        process.exit(1);
    }
}

connectDB();

app.use((req, res, next) => {
    // Set CORS headers so that the React SPA is able to communicate with this server
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET,POST,PUT,PATCH,DELETE,OPTIONS'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });

app.use(cors());

app.use(express.json());

app.use('/api/auth',authRoute);
app.use('/api/posts',postRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));