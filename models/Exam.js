const mongoose = require('mongoose')
const QuestionResultSchema = require('./QuestionResult')

const ExamSchema = new mongoose.Schema({
  

    createdAt: {
        type: Date,
        default: Date.now,
    },
  user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',

    },

    assessor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',

    },

   //درجة الوعي الصوتي
    exam1Score: {
        type: Number,
    },
   
   //درجة الصرف
   exam2Score: {
    type: Number,
},
//درجة قراءة ي
exam3Score: {
    type: Number,
},
//درجة الكتابةي
exam4Score: {
    type: Number,
},
//the current question displayed in the exam
currentIndex: {
    type: Number,
    default:1,
},

//ex1:وعي صوتي ex2:جانب صرفي ex3: قراءة الكلمات ex4: كتابة
status: {
    type: String,
    default: 'في طور الإنجاز',
    enum: ['في طور الإنجاز', 'منتهي'],
},

questionsResults: [{
    type: mongoose.Schema.Types.ObjectId,
   ref: 'QuestionResult',   
}]
   
})
ExamSchema.post('remove', removeLinkedDocuments)

function removeLinkedDocuments(doc) {
    // doc will be the removed Person document
    QuestionResultSchema.remove({_id: { $in: doc.questionsResults }})
}
module.exports = mongoose.model('Exam', ExamSchema)
