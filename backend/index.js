const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const postRouter = require('./routers/postRouter')
const authRouter = require('./routers/authRouter')
const path = require("path");

const PORT = process.env.PORT || 5000





const app = express()
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);

app.use(bodyParser.json());
app.use(express.json());
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "POST, GET, PUT, OPTIONS, PATCH, DELETE"
    );
    next();
  });
app.use("/post", postRouter);
app.use("/auth", authRouter);
app.use("/images", express.static(path.join("images")));


const start = async () => {
    try{
        await mongoose.connect(`MongoDB_key`)
        app.listen(PORT, () => console.log(`server started on port ${PORT}`))
    }catch(e){
        console.log(e)
    }
}

start()