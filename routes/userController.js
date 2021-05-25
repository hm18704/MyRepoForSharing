const express = require('express')
const bcrypt = require('bcryptjs')
const router = express.Router()
const { authRole,ROLE,checkAuthenticated, checkNotAuthenticated } = require('../middleware/auth')

const Student = require('../models/User')




function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'fullName': body['fullNameError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

// @desc    Show nothing
// @route   GET /student
router.get('/', checkAuthenticated, authRole(ROLE.ADMIN),async (req, res) => {
    try {
        const students = await Student.find({role:'Student'})
        
        // .populate('user')
         .sort({ fullName: 'desc' })
         .lean()
         const assessors = await Student.find({role:'Assessor'})
         // .populate('user')
          .sort({ fullName: 'desc' })
          .lean()
     res.render('users/list', {
         students, 
         assessors,
     })

       
    } catch (err) {
        console.error(err)
        res.render('error/500') 
    }
}) 


// @desc    Delete user
// @route   DELETE /users/:id
router.delete('/:id', checkAuthenticated, async (req, res) => {
    try {
        let user = await Student.findById(req.params.id).lean()

        if (!user) {
            return res.render('error/404')
        }

       /* if (story.user != req.user.id) {
            res.redirect('/stories')
        } else {*/
            await Student.remove({ _id: req.params.id })
            res.redirect('/student')
        //}
    } catch (err) {
        console.error(err)
        return res.render('error/500')
    }
})
//@desc register page
//@route POST /register
router.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
        
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
            
        var student = new Student();
        student.fullName = req.body.fullName;
        student.email = req.body.email;
        student.realPassword=req.body.password;
        student.password = hashedPassword;
        student.sex = req.body.sex;
        student.grade = req.body.grade;
        student.nationality = req.body.nationality;
        student.role =  'Student';
        student.save();
        console.log(`student created`)
       res.redirect('/login')
        

    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
   
})


//@desc register page
//@route POST /register
router.post('/registerAssessor', checkNotAuthenticated, async (req, res) => {
    try {
        
        const hashedPassword = await bcrypt.hash(req.body.passwordAssessor, 10)
       
        
        var assessor = new Student();
        assessor.fullName = req.body.fullName;
        assessor.email = req.body.email;
        assessor.realPassword=req.body.passwordAssessor;
        assessor.password = hashedPassword;
        assessor.phoneNumber = req.body.phoneNumber;
        assessor.role =  'Assessor';
       
         assessor.save();
        
          console.log(`assessor created`)
       

       //await assessor.create(req.body)
        res.redirect('/login')
        

    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
   
})




module.exports = router