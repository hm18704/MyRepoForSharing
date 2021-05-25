const mongoose = require('mongoose')


const connectDB = async () => {
  
try {

    const conn = await mongoose.connect(process.env.MONGO_URI, {
   // to stop warning on the console
     useNewUrlParser: true,

      useUnifiedTopology: true,

      useFindAndModify: false,
    })


    console.log(`MongoDB Connected: ${conn.connection.host}`)
  
} catch (err) {

    console.error(err)
    //stop the process
    process.exit(1)

  }
}


module.exports = connectDB
