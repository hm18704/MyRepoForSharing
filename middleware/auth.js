function canDeleteExam(user, exam) {
  console.log(exam)
  return exam.assessor._id === user.id || user.role===ROLE.ADMIN
}

function authRole(role) {
  return (req, res, next) => {
    
    if ((req.user.role !== 'admin') && (req.user.role !== role)) {
      
      res.status(401)
      return res.render('error/401')
    
    }else{
      
    next()
    }
  }
}
const ROLE = {
  ADMIN: 'admin',
  ASSESSOR: 'Assessor',
  STUDENT:'Student'
}
module.exports = {
    checkAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    } else {
      res.redirect('/login')
    }
  },
    checkNotAuthenticated: function (req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    } else {
      res.redirect('/');
    }
  },

  authRole,
  ROLE: ROLE,
  canDeleteExam,
}
