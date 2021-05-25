const express = require('express')
const router = express.Router()
const {authRole,ROLE, checkAuthenticated, canDeleteExam } = require('../middleware/auth')
const {calculateExamsScores } = require('../middleware/utils')

const Exam = require('../models/Exam')
const User = require('../models/User')
const Question = require('../models/Question')
const QuestionResult = require('../models/QuestionResult')
var fileSystem = require("fs");
var fastcsv = require("fast-csv");

//const currentIndex=1
// @desc    Process add form
// @route   GET /add
router.get('/add', checkAuthenticated, async (req, res) => {
  

if((req.user.role===ROLE.ASSESSOR) || (req.user.role===ROLE.ADMIN)){
     const users = await User.find({ role:'Student' })
    .lean()
    
    res.render('exams/add', {
    users: users, 
})
}else{
    return res.render('error/401') 
}
   
    
})





// @desc    Process start exam
// @route   GET /start

router.get('/start/:id', checkAuthenticated, async (req, res) => {
   
    try{
       
        console.log('This is start methode');
        var examLocal = await Exam.findOne({
            _id: req.params.id,
        }).populate('user')
        .populate('assessor')
        .populate({
        path : 'questionsResults',
        populate:{
            path : 'question', 
        }
       })
       .lean()


    var questionR;
    const index=examLocal.currentIndex;
   
     
     if (!examLocal) {
         return res.render('error/404')
     }
        if(index===21){
            
            return res.render('error/304') 
          
        }else{
            examLocal.questionsResults.every(async element => {
                if(element.question.questionNumber ===index){
                  questionR=element;
                 return false;
                }
             });
            res.render('exams/start', {
                    exam: examLocal,
                    questionResult:questionR,
                    myUser:req.user.role,
            })
            }
            
 } catch (err) {
     console.error(err)
     res.render('error/500') 
 }  
 })

// @desc    Process next exam question
// @route   GET /next
router.put('/next/:id', checkAuthenticated, async (req, res) => {
   
    try{

       //console.log('Im here in the next methode with valueeee2232 '+ req.body.score1)
       //console.log('Im here in the next methode with valueeee6666 '+ req.body.score2);
       console.log('Im here in the next methode with value  '+ req.body.stopwatchClock1);
        var examFirstNext = await Exam.findOne({
            _id: req.params.id,
        }).populate('user')
        .populate('assessor')
        .populate({
        path : 'questionsResults',
        populate:{
            path : 'question', 
        }
       })
       .lean()
       
   
    //examLocal.currentIndex=examLocal.currentIndex+1;
    //save the current questionIndex 
    const index=examFirstNext.currentIndex+1;
    let questionR;
    let questionRToBeSaved;
     if(index===21){
       
         console.log('you must close the exam');
         let examNext = await Exam.findOneAndUpdate({
            _id: req.params.id,
        },  { status: 'منتهي' }, {
        new: true
      });
         res.redirect('/exams');
     }else{
        
        let examNext = await Exam.findOneAndUpdate({
            _id: req.params.id,
        },  { currentIndex: examFirstNext.currentIndex+1 }, {
        new: true
      });
  
        examFirstNext.questionsResults.every(async element => {
         if(element.question.questionNumber ===index){
            questionR=element;
            return false;
            }
     });

     //save the  score for the current question
     examFirstNext.questionsResults.every(async element => {
        
       if(element.question.questionNumber ===(index-1)){
           questionRToBeSaved=element;
               return false;
               }
        
    });
    if(req.body.score1!=='undefined'){
        console.log('this mes because score1 is not undefined value');
        let qr = await QuestionResult.findOneAndUpdate({
            _id: questionRToBeSaved._id,
        },  { score1: req.body.score1 }, {
        new: true
      });
    }

    if(req.body.score2!=='undefined'){
        console.log('this mes because score2 is not undefined value');
        let qr = await QuestionResult.findOneAndUpdate({
            _id: questionRToBeSaved._id,
        },  { score2: req.body.score2 }, {
        new: true
      });
    }
   
    if(req.body.stopwatchClock1!=='undefined'){
        console.log('this mes because stopwatchClock1 is not undefined value');
        let qr = await QuestionResult.findOneAndUpdate({
            _id: questionRToBeSaved._id,
        },  { consumedTime: req.body.stopwatchClock1 }, {
        new: true
      });
    }


     res.render('exams/start', {
        exam: examFirstNext,
        questionResult:questionR,
        myUser:req.user.role,
     });
    }
    
     
      
 } catch (err) {
     console.error(err)
     res.render('error/500') 
 }  
 })


 // @desc    Process next exam question for student
// @route   GET /next
router.put('/nextStd/:id', checkAuthenticated, async (req, res) => {
   
    try{
        var examFirstNext = await Exam.findOne({
            _id: req.params.id,
        }).populate('user')
        .populate('assessor')
        .populate({
        path : 'questionsResults',
        populate:{
            path : 'question', 
        }
       })
       .lean()
       
    const index=examFirstNext.currentIndex;
    let questionR;
     if(index===21){
         console.log('you must close the exam');
         res.redirect('/exams');
     }else{
       
         examFirstNext.questionsResults.every(async element => {
         if(element.question.questionNumber ===index){
            questionR=element;
            return false;
            }
     });
     res.render('exams/start', {
        exam: examFirstNext,
        questionResult:questionR,
        myUser:req.user.role,
     });
    }
    
    
      
 } catch (err) {
     console.error(err)
     res.render('error/500') 
 }  
 })


 
// @desc    Process end the exam
// @route   POST /endExam
router.post('/endExam/:id', checkAuthenticated, async (req, res) => {
   
    try{
    console.log("ending the exam: "+req.params.id);
     
    let examNext = await Exam.findOneAndUpdate({
        _id: req.params.id,
    },  { status: 'منتهي', currentIndex:21 }, {
    new: true
  });

  // calculate different exams scores:
  //1. Phonological awareness
  // Suppose S1=(Q1+Q2)-- S2=(Q3+Q4+Q5)--S3=(Q6+Q7)--S4=(Q8)--S5=0.5*(Q9+Q10)--S6=0.5*(FQ11+FQ12)
  //Score={(Ws1*S1)+(Ws2*S2)+(Ws3*S3)+(Ws4*S4)+(Ws5*S5)+(Ws6*S6)/6}*5 to have score/100
        const index=0;
        var S11=0,S12=0,S13=0,S14=0,S15=0,S16=0;
        var S21=0,S22=0;
        var sectionsScore = [0,0,0,0,0,0,0];
        

        sectionsScore=calculateExamsScores(req,res);

        console.log('S1= '+sectionsScore[0]);
        console.log('S2= '+sectionsScore[1]);
        console.log('S3= '+sectionsScore[2]);
        console.log('S4= '+sectionsScore[3]);
        console.log('S5= '+sectionsScore[4]);
        console.log('S6= '+sectionsScore[5]);
      res.redirect('/exams');
 } catch (err) {
     console.error(err)
     res.render('error/500') 
 }  
 })

 
// @desc    Process hold the exam
// @route   POST /holdExam
router.post('/holdExam/:id', checkAuthenticated, async (req, res) => {
   
    try{
    console.log("the exam on hold is: "+req.params.id);
     
    res.redirect('/exams');
 } catch (err) {
     console.error(err)
     res.render('error/500') 
 }  
 })




//create questionResult entity
const createQuestionResult = function(tag) {
    return QuestionResult.create(tag).then(docTag => {
      
      return docTag;
    });
  };


// @desc    Process add form
// @route   POST /exams
router.post('/', checkAuthenticated, async (req, res) => {
    
    try {
        
        const newExam=await Exam.create(req.body)
        await Exam.findByIdAndUpdate(
            newExam._id,
             { assessor: req.user } , 
            { new: true, useFindAndModify: false }
          );
        
        const questions = await Question.find({})
         .sort({ questionNumber: 'asc' })
         .lean()
    
        questions.forEach(async element => {
           // console.log("Creation questionNumber: "+ element.questionNumber)
            var qr = await createQuestionResult({
                question: element._id,
                score1: 0,
                score2: 0,
                consumedTime: 0,
              });
           
            await Exam.findByIdAndUpdate(
                newExam._id,
                { $push: { questionsResults: qr._id } }, 
                { new: true, useFindAndModify: false }
              );
        });

        // res.render('exams/start', {
          //  exam: newExam, 
        //})
        res.redirect('/exams')
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})



// @desc    Show all exams 
// @route   GET /exams
router.get('/', checkAuthenticated, async (req, res) => {

   


    try {
        
    if(req.user.role === ROLE.ADMIN){
        console.log('admin condition')
        const  exams = await Exam.find({})
           .populate('user')
           .populate('assessor')
           .populate({
            path : 'questionsResults',
            populate:{
                path : 'question', 
            }
            })
            .sort({ createdAt: 'desc' })
            .lean()

//export csv file preparation
var questionResultList;
var examsEnded=[];
exams.forEach(async element => {
    if(element.status.localeCompare('منتهي')===0){
        examsEnded.push(element);
    }
})
   /*************csv File Header */
var examToExport='[ ';
examToExport+='{"fullName":"Student name","Gender":"Gender","Nationality":"Nationality","Birthday":"Birthday","ExamDate":"Exam Date","Q1": "Syllable Elision","Q2":"Phoneme Elision","Q3":"Blending two syllables","Q4":"Blending phoneme with the rest of the word onset","Q5":"Blending individual Phonemes","Q6":"Syllab Seg","Q7":"Phonem Seg","Q8":"Isolation","Q9":"Memory of Digits","Q10":"total score for NWR","Q11":"RND _ RTs/errors","Q12":"RNL_ RTs/errors","Q13":"MI","Q14":"Word Creation","Q15":"UWRD","Q16":"NWRD","Q17":"WRF","Q18":"LI","Q19":"SPEL","Q20":"Orthographic Fluency"},'
examsEnded.forEach(async element => {
    questionResultList=element.questionsResults;
    examToExport+='{"fullName":'+'"'+element.user.fullName+'"'
    +',"Gender":'+'"'+element.user.sex+'"'
    +',"Nationality":'+'"'+element.user.nationality+'"'
    +',"Birthday":'+'"'+element.user.birthday+'"'
    +',"ExamDate":'+'"'+element.createdAt+'"'

/****************** sort questions for one exam*/
    var i=0;
    var index=0;
    var questionList=[];
    
    while(index<=19){
    for (i = 0; i < questionResultList.length; i++) {
           
            if(questionResultList[i].question.questionNumber===(index+1)){
                questionList[index]=questionResultList[i];
                index++;
                break;
            }
    }
}
    /****************** sort questions end */

    
    questionList.forEach(async qr => {
        if(qr.question.type.localeCompare('النوع الاول')===0){
            if(qr.score1===null){
                examToExport+=',"Q'+qr.question.questionNumber+'":'+ '"0"'
            }else{
                examToExport+=',"Q'+qr.question.questionNumber+'":'+ '"'+qr.score1+'"'
            }
            
        }else if(qr.question.type.localeCompare('النوع الثاني')===0){
            if(qr.score2===null){
                examToExport+=',"Q'+qr.question.questionNumber+'":'+ '"0'+qr.consumedTime+'"'
            }else{
                examToExport+=',"Q'+qr.question.questionNumber+'":'+ '"'+qr.score2+ ' / '+qr.consumedTime+'"'
            }
            
        }else if(qr.question.type.localeCompare('النوع الثالث')===0){
            if(qr.score1===null){
                examToExport+=',"Q'+qr.question.questionNumber+'":'+ '"0"'
            }else{
                examToExport+=',"Q'+qr.question.questionNumber+'":'+ '"'+qr.score1+'"'
            }
            
        }else if(qr.question.type.localeCompare('النوع الرابع')===0){
            if(qr.score1===null){
                examToExport+=',"Q'+qr.question.questionNumber+'":'+ '"0"'
            }else{
                examToExport+=',"Q'+qr.question.questionNumber+'":'+ '"'+qr.score1+'"'
            }
           
        }else{
            if(qr.score1===null){
                examToExport+=',"Q'+qr.question.questionNumber+'":'+ '"0'+qr.consumedTime+'"'
            }else{
                examToExport+=',"Q'+qr.question.questionNumber+'":'+ '"'+qr.score1+ ' /'+qr.consumedTime+'"'
            }
           
        }
       
     });


     examToExport+='},'
    });

 examToExport= examToExport.substr(0,examToExport.length-1);
 examToExport+=' ]'
// console.log(examToExport);
 var parsed = JSON.parse(examToExport); 

var ws=fileSystem.createWriteStream("public/export/data.csv");
fastcsv.write(parsed, {header:true}).on("finish",function(){
    console.log('finish the export');
})
.pipe(ws);
/********************************** finish export csv******* */
            
            res.render('exams/list', {
                exams: exams, 
                role:req.user.role,
            })
    }else  if(req.user.role === ROLE.ASSESSOR){
        const  exams = await Exam.find({assessor: req.user})
           .populate('user')
           .populate('assessor')
            .sort({ createdAt: 'asc' })
            .lean()
            res.render('exams/list', {
                exams: exams, 
                role:req.user.role,
            })
    }else  if(req.user.role === ROLE.STUDENT){
        const  exams = await Exam.find({user: req.user})
           .populate('user')
           .populate('assessor')
            .sort({ createdAt: 'asc' })
            .lean()
            res.render('exams/list', {
                exams: exams, 
                role:req.user.role,
            })
    }
     
        
    } catch (err) {
        console.error(err)
        res.render('error/500') 
    }
}) 

// @desc    Show view result summary page
// @route   GET /exams/edit/:id
router.get('/edit/:id', checkAuthenticated, async (req, res) => {
    try {
       
        var exam = await Exam.findOne({
            _id: req.params.id,
        }) .populate('user')
        .populate('assessor')
        .populate({
        path : 'questionsResults',
        populate:{
            path : 'question', 
        }
        })
        .sort({ questionNumber: 'asc' })
        .lean()

        var i=0;
    var index=0;
    var questionList=[];
    
    while(index<=19){
    for (i = 0; i < exam.questionsResults.length; i++) {
           
            if(exam.questionsResults[i].question.questionNumber===(index+1)){
                questionList[index]=exam.questionsResults[i];
                index++;
                break;
            }
    }
}
      
    exam.questionsResults=questionList;
        if (!exam) {
            return res.render('error/404')
        }

        if((exam.assessor._id.equals( req.user._id)) || (req.user.role===ROLE.ADMIN)){
            res.render('exams/edit', {
                exam: exam,
            })
        }else{
            return res.render('error/401') 
        }



    } catch (err) {
        console.error(err)
        return res.render('error/500')
    }
})



// @desc    Delete exam
// @route   DELETE /exams/:id
router.delete('/:id', checkAuthenticated,async (req, res) => {
    try {
        let exam = await Exam.findById(req.params.id).lean()
       
        if (!exam) {
            return res.render('error/404')
        }

       /* if (story.user != req.user.id) {
            res.redirect('/stories')
        } else {*/
           
            if((exam.assessor._id.equals( req.user._id)) || (req.user.role===ROLE.ADMIN)){
            await Exam.remove({ _id: req.params.id })
            res.redirect('/exams')
        }else{
            return res.render('error/401') 
        }
           
        //}
    } catch (err) {
        console.error(err)
        return res.render('error/500')
    }
})


function scopedExams(user, exams) {
    if (user.role === ROLE.ADMIN) return exams
    return exams.filter(exam => exam.assessor._id === user.id)
  }

  function authDeleteExam(req,res, exam) {
    if (exam.assessor._id !== req.user.id && req.user.role!==ROLE.ADMIN) {
      res.status(401)
      return res.send('Not Allowed')
    }else{
        return true
    }
  
    
  }

module.exports = router