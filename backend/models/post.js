const {Schema, model} = require('mongoose')

const Post = new Schema({
    title:{
        type: String,
        required: true
    },
    content:{
        type: String,
        required: true
    },
    imagePath:{
        type: String,
        required: true
    },
    creator:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
})


module.exports = model('Post', Post)