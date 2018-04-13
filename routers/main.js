
var express = require('express');
var router = express.Router();

var Category = require('../models/Category');
var Content = require('../models/Content');

var data = {};

router.use(function (req,res,next) {
    data.userInfo = req.userInfo;
    Category.find().then(function (categories) {
        data.categories = categories;
        next();
    });
});

router.get('/',function(req,res,next){
    data.page = Number(req.query.page || 1);
    data.category = req.query.category || '';
    data.limit  = 10 ;
    data.pages = 0;
    data.contents = [];
    data.content = {};

    // 判断当前传递过来的url中是否包含category参数,如果不包含参数，则查询全部
    var where = {};
    if(data.category){
        where.category = data.category;
    }
    
    Content.where(where).count().then(function (count) {
        data.pages = Math.ceil(count/data.limit);
        data.page = Math.min(data.page,data.pages);
        data.page = Math.max(data.page,1);
        return Content.where(where).find().sort({time:-1}).populate(['category','user']).limit(data.limit).skip((data.page-1)*data.limit)
        }).then(function (contents) {
            data.contents = contents;
            res.render('main/index',data);
        });
});

router.get('/view',function (req,res,next) {
    data.category = req.query.category || '';
    var target = req.query.contentid;
    Content.findOne({_id:target}).populate('user')
        .then(function (rs) {
        rs.views +=1;
        rs.save();
        rs.comments = rs.comments.reverse();
        data.content =rs;
        res.render('main/view',data);
    });
});

module.exports = router;
