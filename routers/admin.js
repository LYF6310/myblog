
var express = require('express')
var router = express.Router()
var User = require('../models/User')

router.use(function(req,res,next){
  if(!req.userInfo.isAdmin){
    res.send('对不起，只有管理员才可以进入后台管理');
    return;
  }else{
      next();
  }
})

router.get('/',function(req,res,next){
    res.render('admin/index',{
        userInfo:req.userInfo,
    })
})

router.get('/user',function(req,res,next){   //不需要再写/admin /user是跟在/admin后的

    var page = req.query.page||1;
    var limit = 2;
    var skip = (page - 1)*limit>0 ? (page - 1)*limit : 0;

    User.count().then(function (count) {

        pages = Math.ceil(count/limit);
        page = Math.min(page,pages);

        User.find().skip(skip).limit(limit).then(function (result) {
            res.render('admin/user_index',{
                userInfo:req.userInfo,
                users:result,
                page:page,
            })
        });
    })



})

module.exports = router
