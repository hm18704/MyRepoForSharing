const express = require('express')
const router = express.Router()
const { authRole,ROLE,checkAuthenticated } = require('../middleware/auth')

const Question = require('../models/Question')
const upload = require("../middleware/upload");

router.get('/add', checkAuthenticated, (req, res) => {
    res.render('questions/add')
})

// @desc    Process add form
// @route   POST /questions
router.post('/', checkAuthenticated, async (req, res) => {
    
    try {
        
        await Question.create(req.body)
        await upload(req, res);
        //console.log(req.files);
        res.redirect('/questions')
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})
// @desc    Process upload file form
// @route   POST /questions/files
router.post('/files', checkAuthenticated, async (req, res) => {
    
    try {
        
        await upload(req, res);
        console.log(req.files);
      //  res.redirect('/questions')
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})



// @desc    Show all questions 
// @route   GET /questions
router.get('/', checkAuthenticated, authRole(ROLE.ADMIN),async (req, res) => {
    try {
        const questions = await Question.find({  })
           // .populate('user')
            .sort({ questionNumber: 'asc' })
            .lean()

        res.render('questions/list', {
            questions, 
        })
    } catch (err) {
        console.error(err)
        res.render('error/500') 
    }
}) 

// @desc    Show edit page
// @route   GET /questions/edit/:id
router.get('/edit/:id', checkAuthenticated, async (req, res) => {
    try {
       
        const question = await Question.findOne({
            _id: req.params.id,
        }).lean()

        if (!question) {
            return res.render('error/404')
        }

       /* if (story.user != req.user.id) {
            res.redirect('/stories')
        } else {*/
            res.render('questions/edit', {
                question: question,
            })
        //}
    } catch (err) {
        console.error(err)
        return res.render('error/500')
    }
})


// @desc    Update question
// @route   PUT /questions/:id
router.put('/:id', checkAuthenticated, async (req, res) => {
    try {
        let question = await Question.findById(req.params.id).lean()

        if (!question) {
            return res.render('error/404')
        }

      /*  if (story.user != req.user.id) {
            res.redirect('/stories')
        } else {*/
            question = await Question.findOneAndUpdate({ _id: req.params.id }, req.body, {
                new: true,
                runValidators: true,
            })
 
            res.redirect('/questions')
        //}
    } catch (err) {
        console.error(err)
        return res.render('error/500')
    }
})

// @desc    Delete question
// @route   DELETE /questions/:id
router.delete('/:id', checkAuthenticated, async (req, res) => {
    try {
        let question = await Question.findById(req.params.id).lean()

        if (!question) {
            return res.render('error/404')
        }

       /* if (story.user != req.user.id) {
            res.redirect('/stories')
        } else {*/
            await Question.remove({ _id: req.params.id })
            res.redirect('/questions')
        //}
    } catch (err) {
        console.error(err)
        return res.render('error/500')
    }
})

module.exports = router