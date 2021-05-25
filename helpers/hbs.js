const moment = require('moment')

module.exports = {
  
//display Scoring Bloc For Assessor
  displayScoringBlocForAssessor: function (myUser, questionResult) {
    console.log('displayScoringBlocForAssessor ' );

    var startBloc=`<div class="card-content">
                    <div class="row">
                       <h4  style="color:#5a2f2f">الخانة الخاصّة بالمقيّم</h4>
   
                  </div></div>`; 


var timingBloc=`<div class="container stopwatch">
                <span class="card-title" > احتساب التوقيت:  </span>                
                <a id="stopwatch-btn-start" class="waves-effect waves-teal btn-flat" style="font-size:x-large;">إبدأ</a>
                  <a id="stopwatch-btn-pause" class="waves-effect waves-teal btn-flat"  style="font-size:x-large;">أوقف</a>
                  <a id="stopwatch-btn-reset" class="waves-effect waves-teal btn-flat"  style="font-size:x-large;">إعادة للصفر</a>
                <div class="clock inactive z-depth-1" style="width:100px; margin-top:10px;">
                  <span id="stopwatchClock"  name="stopwatchClock">0:00:00.0</span>
                  <input type="hidden" id="stopwatchClock1"  name="stopwatchClock1"></input>
                </div>
              </div>`;
var maxScoringBloc=`<div class="row">
              <div class="input-field">
                 <span class="card-title" > أعلى درجة ممكنة  : </span>
                  <span  id="maxScore" style="width:100px;font-size:25px;" name="maxScore">${questionResult.question.maxScore}</span>
                 </div>
          </div>`;

var scoringBloc=`<div class="row">
                    <div class="input-field">
                       <span class="card-title" > عدد الإجابات الصحيحة: </span>
                        <input type="number" id="score1" style="width:100px;" name="score1"></input>
                        <a class="btn-floating btn-large waves-effect waves-light red" onclick="return incrementValue('score1');"><i class="fas fa-plus"></i></a>
                    </div>
                </div>`;

var scoring2Bloc=`<div class="row">
                <div class="input-field">
                   <span class="card-title" > عدد الإجابات الخاطئة: </span>
                    <input type="number" id="score2" style="width:100px;" name="score2"></input>
                    <a class="btn-floating btn-large waves-effect waves-light red" onclick="return incrementValue('score2');"><i class="fas fa-plus"></i></a>
                </div>
            </div>`;                

var assessorBloc=startBloc; 

if(questionResult.question.type.localeCompare('النوع الاول')===0){
   assessorBloc=assessorBloc+maxScoringBloc+scoringBloc;
}else  if(questionResult.question.type.localeCompare('النوع الثاني')===0){
   assessorBloc+=scoring2Bloc+timingBloc; 
}else  if(questionResult.question.type.localeCompare('النوع الثالث')===0){
   assessorBloc=assessorBloc+maxScoringBloc+scoringBloc;
}else  if(questionResult.question.type.localeCompare('النوع الرابع')===0){
   assessorBloc=assessorBloc+maxScoringBloc+scoringBloc;
}else  if(questionResult.question.type.localeCompare('النوع الخامس')===0){
   assessorBloc=assessorBloc+maxScoringBloc+scoringBloc+timingBloc; 
}

if(myUser.localeCompare('Assessor')===0 ||myUser.localeCompare('admin')===0){
  console.log('the assessor bloc');
  return assessorBloc;
}else{
  console.log('the student bloc');
  return ``;
}
  },

//************************************************************* */
//display end exam For Assessor
displayEndExamButtonForAssessor: function (myUser) {
                
  var assessorBtnBloc=`<button type="submit" class="btn red"  >
  <i class="fas fa-times-circle"> إنهاء الإختبار </i>`; 
  
  
  if(myUser.localeCompare('Assessor')===0 ||myUser.localeCompare('admin')===0){
    return assessorBtnBloc;
  }else{
    return ``;
  }
    },
    //************************************************************* */
//display end exam For Assessor
displayHoldExamButtonForAssessor: function (myUser) {
                
  var assessorBtnBloc=` <button type="submit" class="btn reen"  >
  <i class="fas fa-check-circle"> حفظ مؤقت </i>`; 
  
  
  if(myUser.localeCompare('Assessor')===0 ||myUser.localeCompare('admin')===0){
    return assessorBtnBloc;
  }else{
    return ``;
  }
    },
//************************************************************* */
//display NextButton For Assessor
  displayNextButtonForAssessor: function (myUser) {
                
var assessorBtnBloc=` <div class="input-field">
                <span class="card-title" > السّؤال التّالي </span>
                 <button type="submit" class="btn blue"  >
                    <i class="fas fa-step-backward"></i>
                </button>
               
                </div>`; 


if(myUser.localeCompare('Assessor')===0 ||myUser.localeCompare('admin')===0){
  return assessorBtnBloc;
}else{
  return ``;
}
  },





//************************************************************* */
//display NextButton For student: control to not go next until click next by the assessor
  displayNextButtonForStudent: function (myUser) {

    var studentBloc=                 
                    ` <div class="input-field">
                    <span class="card-title"  > السّؤال التّالي </span>
                     <button type="submit" class="btn red"  >
                        <i class="fas fa-step-backward"></i>
                      </button>
                   
                    </div>`; 
    if(myUser.localeCompare('Assessor')===0 ||myUser.localeCompare('admin')===0){
      return ``;
    }else{
      return studentBloc;
    }
      },

//************************************************************* */
//view questions summary 
      viewQuestion: function (questionResult) {
   
  
        
        var communBloc=`<span class="card-title" style="color:rgba(0, 102, 255, 1)">السّؤال ${questionResult.question.questionNumber} : ${questionResult.question.section}</span>
                  
        <span class="card-title">${questionResult.question.title}</span> `; 
     
       
                  
              //1,2 AND 4TH TYPE      
           var firstTypeBloc=`<h5>مجموع الاجابات الصحيحة: ${questionResult.score1} من اصل ${questionResult.question.maxScore}</h5>`;
           var secondTypeBloc=`<h5>مجموع الاجابات الخاطئة: ${questionResult.score2}</h5>
                                <h5  style="margin-bottom:60px;">التوقيت: ${questionResult.consumedTime}</h5>`;
        
                            
           
           var fifthTypeBloc=`<h5>مجموع الاجابات الصحيحة: ${questionResult.score1}من اصل ${questionResult.question.maxScore}</h5>
           <h5  style="margin-bottom:60px;">التوقيت: ${questionResult.consumedTime}</h5>`;            
           if(questionResult.question.type.localeCompare('النوع الاول')===0){
             return communBloc+firstTypeBloc;
           }else  if(questionResult.question.type.localeCompare('النوع الثاني')===0){
             return communBloc+secondTypeBloc;
           }else  if(questionResult.question.type.localeCompare('النوع الثالث')===0){
             return communBloc+firstTypeBloc;
           }else  if(questionResult.question.type.localeCompare('النوع الرابع')===0){
             return communBloc+firstTypeBloc;
           }else  if(questionResult.question.type.localeCompare('النوع الخامس')===0){
             return communBloc+fifthTypeBloc;
           }
           },

//************************************************************* */
  //display the question content in the current exam
  displayQuestion: function (questionResult, myUser) {
   
  
   var audioFileName='/audio/Q'+questionResult.question.questionNumber+'.mp3';
   var imageName='/photos/Q'+questionResult.question.questionNumber+'.png';
   var startBloc=`<div class="row">
                       <h4  style="color:#5a2f2f">الرّجاء فتح المكالمة بالفيديو لبدءالإختبار عبر النّقر على ايقونة الهاتف </h4>
   
                  </div>`; 
var bgCol='#27ac95'  ;                

  var progressBloc=`<div class="row">
                  <img src="/photos/T1.png" alt="الاختبار الأول" width="800" height="150">
                </div>`;
             if(questionResult.question.exam.localeCompare('الجانب الصرفي')===0){
              progressBloc=`<div class="row">
                     <img src="/photos/T2.png" alt="الجانب الصرفي" width="800" height="150">
                      </div>`;
                      bgCol='#1bb1ec'  ;       
             } else if(questionResult.question.exam.localeCompare('قراءة الكلمات')===0){
              progressBloc=`<div class="row">
              <img src="/photos/T3.png" alt="قراءة الكلمات" width="800" height="150">
             </div>`;
             bgCol='#0a67d4'  ;
             }else if(questionResult.question.exam.localeCompare('كتابة')===0){
              progressBloc=`<div class="row">
              <img src="/photos/T4.png" alt="كتابة" width="800" height="150">
            </div>`;
            bgCol='#0f51a9'  ;
             }
   var communBloc=progressBloc+`
                  <span id="ques" style="background-color:${bgCol};font-weight:bold;color:#ffffff;" class="card-title">السّؤال ${questionResult.question.questionNumber} : ${questionResult.question.section}</span>
                  
                  <span id="questit" style="background-color:${bgCol};font-weight:bold;color:#ffffff;" class="card-title">${questionResult.question.title}</span>
             
                  <h5>${questionResult.question.instructions}</h5>
                  <div class="row">
                    <div class="input-field" style="margin-right:250px">
                        <audio controls src="${audioFileName}"> متصفح الواب خاصتك لا يمكنه قراءة ملفات صوتية <code>audio</code>. </audio>
                    </div>
                  </div>`;

                  if(questionResult.question.questionNumber===1){
                    communBloc=startBloc+communBloc;
                  } else{
                    communBloc=progressBloc+`<span  style="background-color:${bgCol};font-weight:bold;color:#ffffff;"  class="card-title">السّؤال ${questionResult.question.questionNumber} : ${questionResult.question.section}</span>
                  
                    <span  style="background-color:${bgCol};font-weight:bold;color:#ffffff;"  class="card-title">${questionResult.question.title}</span>
               
                    <h5>${questionResult.question.instructions}</h5>
                    <div class="row">
                      <div class="input-field" style="margin-right:250px">
                          <audio controls src="${audioFileName}"> متصفح الواب خاصتك لا يمكنه قراءة ملفات صوتية <code>audio</code>. </audio>
                      </div>
                    </div> `;
                  }            
               
      var firstTypeBloc=`<div class="row">
                            <div class="input-field" style="margin-right:10px">
                                <img src="${imageName}" alt="${imageName}" width="100%;" height="100%;"> 
                            </div>
                          </div>`;


                          if(myUser.localeCompare('Assessor')===0 ||myUser.localeCompare('admin')===0){
                            console.log('the assessor bloc');
                            firstTypeBloc=`<div class="row">
                            <div class="input-field" style="margin-right:10px">
                                <img src="${imageName}" alt="${imageName}" width="100%;" height="100%;"> 
                            </div>
                          </div>`;
                          }else{
                            console.log('the student bloc');
                            firstTypeBloc= ``;
                          }                   
      var secondTypeBloc=`<div class="row">
                            <div class="input-field" style="margin-right:10px">
                            <img src="${imageName}" alt="${imageName}" width="100%;" height="100%;"> 
                            </div>
                          </div>`;
   
                          if(myUser.localeCompare('Assessor')===0 ||myUser.localeCompare('admin')===0){
                            var pathAssessor='/photos/Q'+questionResult.question.questionNumber+'-Assessor.png';
                            var pathStudent='/photos/Q'+questionResult.question.questionNumber+'.gif';
                          var thirdTypeBloc=`<div class="row">
                         <a href="javascript:setImageQVisible('myImageAssessor',${questionResult.question.questionNumber})"  style="font-size:30px"><i class="fas fa-plus-circle"></i>عرض المثال</a>
                         <a href="javascript:setImageVisible('myImageAssessor',${questionResult.question.questionNumber})"  style="font-size:30px"><i class="fas fa-trophy"></i>ابدأ اللعب</a>
                         <div class="input-field" style="margin-right:10px">
                          <img id="myImageAssessor"  visible="false"  src="${pathAssessor}" alt="question" width="100%;" height="100%;"> 
                          </div>
                         
                        </div>
                        `}else{
                          var thirdTypeBloc=`<div class="row">
                          <a href="javascript:setImageQVisible('myImageId',${questionResult.question.questionNumber})"  style="font-size:30px"><i class="fas fa-plus-circle"></i>عرض المثال</a>
                          <a href="javascript:setImageVisible('myImageId',${questionResult.question.questionNumber})"  style="font-size:30px"><i class="fas fa-trophy"></i>ابدأ اللعب</a>
                          <div class="input-field" style="margin-right:10px">
                           <img id="myImageId"  visible="false"  src="${pathStudent}" alt="question" width="100%;" height="100%;"> 
                           </div>
                          
                         </div>
                         `
                        };
                       
      
      var fifthTypeBloc=``;            
      if(questionResult.question.type.localeCompare('النوع الاول')===0){
        return communBloc+firstTypeBloc;
      }else  if(questionResult.question.type.localeCompare('النوع الثاني')===0){
        return communBloc+secondTypeBloc;
      }else  if(questionResult.question.type.localeCompare('النوع الثالث')===0){
        return communBloc+thirdTypeBloc;
      }else  if(questionResult.question.type.localeCompare('النوع الرابع')===0){
        return communBloc+secondTypeBloc;
      }else  if(questionResult.question.type.localeCompare('النوع الخامس')===0){
        return communBloc+secondTypeBloc;
      }
      },


    
  formatDate: function (date, format) {
    return moment(date).utc().format(format)
  },
  truncate: function (str, len) {
    if (str.length > len && str.length > 0) {
      let new_str = str + ' '
      new_str = str.substr(0, len)
      new_str = str.substr(0, new_str.lastIndexOf(' '))
      new_str = new_str.length > 0 ? new_str : str.substr(0, len)
      return new_str + '...'
    }
    return str
  },
  stripTags: function (input) {
    return input.replace(/<(?:.|\n)*?>/gm, '')
  },
  editIcon: function ( storyId, floating = true) {
    //if (storyUser._id.toString() == loggedUser._id.toString()) {
      if (floating) {
        return `<a href="/stories/edit/${storyId}" class="btn-floating halfway-fab blue"><i class="fas fa-edit fa-small"></i></a>`
      } else {
        return `<a href="/stories/edit/${storyId}"><i class="fas fa-edit"></i></a>`
      }
    //} else {
      //return ''
    //}
  },
  select: function (selected, options) {
    return options
      .fn(this)
      .replace(
        new RegExp(' value="' + selected + '"'),
        '$& selected="selected"'
      )
      .replace(
        new RegExp('>' + selected + '</option>'),
        ' selected="selected"$&'
      )
  },
}
