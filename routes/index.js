const express = require('express')
const fs = require('fs'); 
const router = express.Router()
const { authRole,ROLE,checkAuthenticated, checkNotAuthenticated } = require('../middleware/auth')

const Story = require('../models/Story')
const user = require('../models/User')


router.get('/', checkAuthenticated, (req, res) => {
    res.render('dashboard.hbs')
})


//@desc dashboard page  
//@route GET /dashboad
router.get('/dashboard', checkAuthenticated, async (req, res) => {
    const stories = await Story.find().lean()
    res.render('dashboard.hbs', {
        name: req.user.firstName,
        stories,
    }) 
})


//@desc statistics page
//@route GET /statistics
router.get('/statistics', checkAuthenticated,authRole(ROLE.ASSESSOR), async (req, res) => {
  
    res.render('statistics.hbs', {
         }) 
})







module.exports = router