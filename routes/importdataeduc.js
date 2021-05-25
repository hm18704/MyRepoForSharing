//to run the scipt: console --> node routes/importdata.js routes/importFile/Book2.xlsx
const xlsx =require('xlsx');
const Student = require('../models/User')

const Exam = require('../models/Exam')
const Question = require('../models/Question')
const QuestionResult = require('../models/QuestionResult')

const filePath=process.argv.slice(2)[0];
console.log(filePath);
const workbook=xlsx.readFile(filePath);
//console.log(workbook);
const worksheet=workbook.Sheets[workbook.SheetNames[0]];



const connectDB = require('../config/dbimport.js')

const posts=[];
let post={};
connectDB();

var student = new Student();
var exam= new Exam();
var qr= new QuestionResult();

var qrList=[];
var finalQrList=[];
for (let cell in worksheet){
    const cellAsString=cell.toString();
    /*if(cellAsString[1]!=='r' 
    && cellAsString !=='m') {
    console.log('cellAsString[0] ' + cellAsString[0]+ ' cellAsString[1] '+ cellAsString[1] + ' cellAsString '+ cellAsString);
    console.log('cell.toString() ' + cell.toString());
    }*/
     if(cellAsString[1]!=='r' 
    && cellAsString !=='m' && cellAsString[1]>1) {
      
        if(cellAsString[0]==='A'){
            student.fullName=worksheet[cell].v;
        }
        if(cellAsString[0]==='B'){
            student.sex=worksheet[cell].v;
        }
        if(cellAsString[0]==='C'){
            student.nationality=worksheet[cell].v;
         }
        if(cellAsString[0]==='D'){
            student.birthday=worksheet[cell].v;
        }
        if(cellAsString[0]==='F'){
            //student.grade=worksheet[cell].v;
            //console.log('column F ' + student.grade);
            student.email='importedFromPaper@teals.site';
            student.password='imported';
            student.save(); 
            console.log('student saved '+ student._id);
           
            
            //TODO change the assessor
            exam.assessor=student;
            exam.user=student;
            student=new Student();
            exam.currentIndex=20;
            exam.status='منتهي';
            
        }
        if(cellAsString[0]==='G'){
            console.log('column G ' + worksheet[cell].v+ ' qrList before '+ qrList.length);
            qr.score1=worksheet[cell].v;
            qr.Question=async () => {await Question.findOne({ questionNumber: 1 }).exec();}
            qrList.push(qr);
            qr=new QuestionResult();
        }
        if(cellAsString[0]==='H'){
            console.log('column H ' + worksheet[cell].v+ ' qrList before '+ qrList.length);
            qr.score1=worksheet[cell].v;
            qr.Question=async () => {await Question.findOne({ questionNumber: 2 }).exec();}
            qrList.push(qr);
            qr=new QuestionResult();
        }
        if(cellAsString[0]==='I'){
            console.log('column I ' + worksheet[cell].v+ ' qrList before '+ qrList.length);
            qr.score1=worksheet[cell].v;
            qr.Question=async () => {await Question.findOne({ questionNumber: 3 }).exec();}
            qrList.push(qr);
            qr=new QuestionResult();
        }
        if(cellAsString[0]==='J'){
            console.log('column J ' + worksheet[cell].v+ ' qrList before '+ qrList.length);
            qr.score1=worksheet[cell].v;
            qr.Question=async () => {await Question.findOne({ questionNumber: 4 }).exec();}
            qrList.push(qr);
            qr=new QuestionResult();
        }

        if(cellAsString[0]==='K'){
            console.log('column K ' + worksheet[cell].v+ ' qrList before '+ qrList.length);
            qr.score1=worksheet[cell].v;
            qr.Question=async () => {await Question.findOne({ questionNumber: 5 }).exec();}
            qrList.push(qr);
            qr=new QuestionResult();
        }
        if(cellAsString[0]==='L'){
            console.log('column L ' + worksheet[cell].v+ ' qrList before '+ qrList.length);
            qr.score1=worksheet[cell].v;
            qr.Question=async () => {await Question.findOne({ questionNumber: 6 }).exec();}
            qrList.push(qr);
            qr=new QuestionResult();
        }
        if(cellAsString[0]==='M'){
            console.log('column M ' + worksheet[cell].v+ ' qrList before '+ qrList.length);
            qr.score1=worksheet[cell].v;
            qr.Question=async () => {await Question.findOne({ questionNumber: 7 }).exec();}
            qrList.push(qr);
            qr=new QuestionResult();
        }
        if(cellAsString[0]==='N'){
            console.log('column N ' + worksheet[cell].v+ ' qrList before '+ qrList.length);
            qr.score1=worksheet[cell].v;
            qr.Question=async () => {await Question.findOne({ questionNumber: 8 }).exec();}
            qrList.push(qr);
            qr=new QuestionResult();
        }
        if(cellAsString[0]==='O'){
            console.log('column O ' + worksheet[cell].v+ ' qrList before '+ qrList.length);
            qr.score1=worksheet[cell].v;
            qr.Question=async () => {await Question.findOne({ questionNumber: 9 }).exec();}
            qrList.push(qr);
            qr=new QuestionResult();
        }
        if(cellAsString[0]==='P'){
            console.log('column P ' + worksheet[cell].v+ ' qrList before '+ qrList.length);
            qr.score1=worksheet[cell].v;
            qr.Question=async () => {await Question.findOne({ questionNumber: 10 }).exec();}
            qrList.push(qr);
            qr=new QuestionResult();
        }

        
        if(cellAsString[0]==='Q'){
            console.log('column Q ' + worksheet[cell].v+ ' qrList before '+ qrList.length);
            qr.consumedTime=worksheet[cell].v;
            qr.Question=async () => {await Question.findOne({ questionNumber: 11 }).exec();}
            qrList.push(qr);
            qr=new QuestionResult();
        }
        if(cellAsString[0]==='R'){
            console.log('column R ' + worksheet[cell].v+ ' qrList before '+ qrList.length);
            qr.score2=worksheet[cell].v;
            qr.Question=async () => {await Question.findOne({ questionNumber: 11 }).exec();}
            qrList.push(qr);
            qr=new QuestionResult();
        }
        if(cellAsString[0]==='S'){
            console.log('column S ' + worksheet[cell].v+ ' qrList before '+ qrList.length);
            qr.consumedTime=worksheet[cell].v;
            qr.Question=async () => {await Question.findOne({ questionNumber: 12 }).exec();}
            qrList.push(qr);
            qr=new QuestionResult();
        }
        if(cellAsString[0]==='T'){
            console.log('column T ' + worksheet[cell].v+ ' qrList before '+ qrList.length);
            qr.score2=worksheet[cell].v;
            qr.Question=async () => {await Question.findOne({ questionNumber: 12 }).exec();}
            qrList.push(qr);
            qr=new QuestionResult();
        }
        //Q R S and T for Q11 and Q12
        if(cellAsString[0]==='U'){
            console.log('column U ' + worksheet[cell].v+ ' qrList before '+ qrList.length);
            qr.score1=worksheet[cell].v;
            qr.Question=async () => {await Question.findOne({ questionNumber: 13 }).exec();}
            qrList.push(qr);
            qr=new QuestionResult();
        }
        if(cellAsString[0]==='V'){
            console.log('column V ' + worksheet[cell].v+ ' qrList before '+ qrList.length);
            qr.score1=worksheet[cell].v;
            qr.Question=async () => {await Question.findOne({ questionNumber: 14 }).exec();}
            qrList.push(qr);
            qr=new QuestionResult();
        }

        if(cellAsString[0]==='W'){
            console.log('column W ' + worksheet[cell].v+ ' qrList before '+ qrList.length);
            qr.score1=worksheet[cell].v;
            qr.Question=async () => {await Question.findOne({ questionNumber: 15 }).exec();}
            qrList.push(qr);
            qr=new QuestionResult();
        }
        if(cellAsString[0]==='X'){
            console.log('column X ' + worksheet[cell].v+ ' qrList before '+ qrList.length);
            qr.score1=worksheet[cell].v;
            qr.Question=async () => {await Question.findOne({ questionNumber: 16 }).exec();}
            qrList.push(qr);
            qr=new QuestionResult();
        }
        //Y and Z for Q17
     
        if(cellAsString[0]==='Y'){
            console.log('column Y ' + worksheet[cell].v+ ' qrList before '+ qrList.length);
            qr.consumedTime='60';
            qr.Question=async () => {await Question.findOne({ questionNumber: 17 }).exec();}
            qrList.push(qr);
            qr=new QuestionResult();
        }

        if(cellAsString[0]==='Z'){
            console.log('column Z ' + worksheet[cell].v+ ' qrList before '+ qrList.length);
            qr.score2=worksheet[cell].v;
            qr.Question=async () => {await Question.findOne({ questionNumber: 17 }).exec();}
            qrList.push(qr);
            qr=new QuestionResult();
        }
       

       
    }
    if(cellAsString[1]!=='r' 
    && cellAsString !=='m' && cellAsString[2]>1) {
           if(cellAsString[0]==='A' && cellAsString[1]==='A'){
            console.log('column AA ' + worksheet[cell].v);
            qr.score1=worksheet[cell].v;
            qr.Question=async () => {await Question.findOne({ questionNumber: 18 }).exec();}
            qrList.push(qr);
            qr=new QuestionResult();
        }
        if(cellAsString[0]==='A' && cellAsString[1]==='B'){
            console.log('column AB ' + worksheet[cell].v);
            qr.score1=worksheet[cell].v;
            qr.Question=async () => {await Question.findOne({ questionNumber: 19 }).exec();}
            qrList.push(qr);
            qr=new QuestionResult();
        }
        if(cellAsString[0]==='A' && cellAsString[1]==='B'){
            console.log('column AC ' + worksheet[cell].v+ ' qrList before '+ qrList.length);
           
            qr.score1=worksheet[cell].v;
            qr.Question=async () => {await Question.findOne({ questionNumber: 20 }).exec();}
            qrList.push(qr);
            
            qrList.forEach(async elt => {
                var qrSaved =await QuestionResult.create(elt).then(docTag => {
      
                    finalQrList.push(docTag);
                  });
                  console.log('finalQrList '+finalQrList.length)
                 /* await Exam.findByIdAndUpdate(
                    exam._id,
                    { $push: { questionsResults: qrSaved } }, 
                    { new: true, useFindAndModify: false }
                  );*/
            });
            finalQrList.forEach(async elt => {
                
                  await Exam.findByIdAndUpdate(
                    exam._id,
                    { $push: { questionsResults: elt._id } }, 
                    { new: true, useFindAndModify: false }
                  );
            });
           
            exam.save();
           
           
            console.log('exam saved '+exam._id)
           

            //initialisation
           // student = new Student();
            exam = new Exam();
            qrList=[];
            finalQrList=[];
            qr=new QuestionResult();
        }
        
    }
    
}

