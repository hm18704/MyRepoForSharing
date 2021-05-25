const mongoose = require('mongoose')


const connectDB = async () => {
  
try {

    const conn = await mongoose.connect('mongodb://localhost:27017/EducationassessmentDB', {
   // to stop warning on the console
     useNewUrlParser: true,

      useUnifiedTopology: true,

      useFindAndModify: false,
    })


    console.log(`MongoDB Connected for import: ${conn.connection.host}`)
  
} catch (err) {

    console.error(err)
    //stop the process
    process.exit(1)

  }
}


module.exports = connectDB
