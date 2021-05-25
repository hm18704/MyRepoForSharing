const mongoose = require('mongoose')

const QuestionResultSchema = new mongoose.Schema({
    
    score1:{
        default:0,
        type: Number,
    },
    score2:{
        default:0,
        type: Number,
    },
    consumedTime:{
        default:0,
        type: String,
    },
   
    question: {
        type: mongoose.Schema.Types.ObjectId,
       ref: 'Question',
        }
  
})

module.exports = mongoose.model('QuestionResult', QuestionResultSchema)
