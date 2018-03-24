
var express = require('express')
var router = express.Router()

router.get('/user',function(req,res,next){   //不需要再写/admin /user是跟在/admin后的
  res.send('User - Admin')
})

module.exports = router
