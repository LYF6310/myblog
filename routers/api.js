
var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Content = require('../models/Content');


var responseData = {
  code:0,
  message:'',
};
router.use(function(req,res,next){
  responseData = {
    code:0,
    message:'',
  };
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

router.post('/user/login',function(req,res,next){
    var username = req.body.username;
    var password = req.body.password;
    User.findOne({
        username:username,
        password:password,
    }).then(function (result) {
        if(!result) {
            responseData.code = 2;
            responseData.message = '用户名或密码错误';
            res.json(responseData);
            return;
        }
        responseData.message = '登录成功';
        responseData.userInfo = {
            _id:result._id,
            username:result.username,
        };
        req.cookies.set('userInfo',JSON.stringify({
            _id:result._id,
            username:result.username,
        }));
        res.json(responseData);
    });
});

router.get('/user/logout',function(req,res){
    req.cookies.set('userInfo',null);
    res.json(responseData);
});

//评论提交
router.post('/comment/post',function (req,res,next) {
    //文章的ID
    var contentId = req.body.contentid ||'';
    var postData = {
        username:req.userInfo.username,
        postTime:new Date(),
        content:req.body.content,
    };
    //查询这篇文章的信息
    Content.findOne({
        _id:contentId
    }).then(function (content) {
        content.comments.push(postData);
        return content.save();
    }).then(function (newComment) {
        responseData.data = newComment;
        responseData.msg = '评论成功';
        res.json(responseData);
    })
});

router.post('/comments',function (req,res,next) {
    var contentId = req.body.contentid ||'';
    Content.findOne({
        _id:contentId,
    }).then(function (rs) {
        responseData.comments = rs.comments;
        res.json(responseData);
    })
});

module.exports = router;
