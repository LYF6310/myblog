
var express = require('express');
var router = express.Router();
var User = require('../models/User');

var responseData = {
  code:0,
  message:'',
};
router.use(function(req,res,next){
  responseData = {
    code:0,
    message:'',
  }
  next();
});

router.get('/user',function(req,res,next){
    res.send('User-API')
});

router.post('/user/register',function(req,res,next){
    var username = req.body.username;
    var password = req.body.password;
    var repassword = req.body.repassword;
//后端验证部分，以后有空改到前端去
    if(username ==''){
      responseData.code = 1;
      responseData.message = '用户名不能为空！';
      res.json(responseData);
      return;
    }
    if(password ==''){
      responseData.code = 2;
      responseData.message = '密码不能为空！';
      res.json(responseData);
      return;
    }
    if(password !=repassword){
      responseData.code = 3;
      responseData.message = '两次输入的密码不一致！';
      res.json(responseData);
      return;
    }

    User.findOne({
      username:username,
    }).then(function(userInfo){
      if(userInfo){
        responseData.code = 4;
        responseData.message = '用户名已被注册！';
        res.json(responseData);
        return;
      }
      var user = new User({
        username:username,
        password:password,
      });
      return user.save();
    }).then(function(newUserInfo){
      if(newUserInfo){
        console.log(newUserInfo,responseData,'61')
        responseData.message = '注册成功！';
        res.json(responseData);
      }
    })
});



module.exports = router;
