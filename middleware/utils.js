const Exam = require('../models/Exam')
module.exports = {

   // calculate different exams scores:
  //1. Phonological awareness
  // Suppose S1=(Q1+Q2)-- S2=(Q3+Q4+Q5)--S3=(Q6+Q7)--S4=(Q8)--S5=0.5*(Q9+Q10)--S6=0.5*(FQ11+FQ12)
  //Score={(Ws1*S1)+(Ws2*S2)+(Ws3*S3)+(Ws4*S4)+(Ws5*S5)+(Ws6*S6)/6}*5 to have score/100



    calculateExamsScores: async function (req,res) {
        
        console.log('start calculate method '+ req.params.id);
        var myExam = await Exam.findOne({
            _id: req.params.id,
        }).populate({
        path : 'questionsResults',
        populate:{
            path : 'question', 
        }
        })
        .lean()
        console.log('myExam founded  '+ myExam._id);
        var sectionsScore = [0,0,0,0,0,0,0,0,0];
  
        myExam.questionsResults.every(async element => {
            switch (element.question.questionNumber) {
                case 1:
                sectionsScore[0] += element.score1;
                  break;
                case 2:
                    sectionsScore[0]  += element.score1;
                  break;
                case 3:
                    sectionsScore[1]  += element.score1;
                  break;
                case 4:
                    sectionsScore[1]  += element.score1;
                  break;
                case 5:
                    sectionsScore[1]  += element.score1;
                  break;
                case 6:
                    sectionsScore[2]  += element.score1;
                  break;
                case 7:
                    sectionsScore[2]  += element.score1;
                    break;
                case 8:
                    sectionsScore[3]  += element.score1;
                    break;
                case 9:
                    sectionsScore[4]  += element.score1;
                    break;
                case 10:
                    sectionsScore[4]  += element.score1;
                    break;
                case 11://rule not defined yet
                    sectionsScore[5]  += element.score1;
                    break;
                case 12://rule not defined yet
                    sectionsScore[5]  += element.score1;
                    break;
                case 13:
                    sectionsScore[6]  += element.score1;
                    break;
                case 14:
                    sectionsScore[6]  += element.score1;
                    break;  
                case 15:
                    sectionsScore[7] += element.score1;
                    break;

                case 16:
                    sectionsScore[7] += element.score1;
                    break;
                case 17:
                    sectionsScore[7] += element.score1;
                    break;
                case 18:
                    sectionsScore[8] += element.score1;
                    break;
                case 19:
                    sectionsScore[8] += element.score1;
                    break;
                case 20:
                    sectionsScore[8] += element.score1;
                    break;
              }
   
        });

        let examNext = await Exam.findOneAndUpdate({
            _id: req.params.id,
        },  { exam1Score: sectionsScore[0]+sectionsScore[1]+sectionsScore[2]+sectionsScore[3]+sectionsScore[4],
            exam2Score: sectionsScore[6],
            exam3Score: sectionsScore[7],
            exam4Score: sectionsScore[8] }, {
        new: true
      });
        console.log('inside S1= '+sectionsScore[0]);
        console.log('inside S2= '+sectionsScore[1]);
        console.log('inside S3= '+sectionsScore[2]);
        console.log('inside S4= '+sectionsScore[3]);
        console.log('inside S5= '+sectionsScore[4]);
        console.log('inside S6= '+sectionsScore[5]);
        return sectionsScore; 
  },
    
}