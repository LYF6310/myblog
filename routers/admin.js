
var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Category = require('../models/Category');
var Content = require('../models/Content');

router.use(function(req,res,next){
  if(!req.userInfo.isAdmin){
    res.send('对不起，只有管理员才可以进入后台管理');
    return;
  }else{
      next();
  }
});

router.get('/',function(req,res,next){
    res.render('admin/index',{
        userInfo:req.userInfo,
    })
});
/*
*分类管理
**/
router.get('/category',function(req,res,next){
    var page = req.query.page||1;
    var limit = 10;
    var skip = (page - 1)*limit>0 ? (page - 1)*limit : 0;

    Category.count().then(function (count) {
        pages = Math.ceil(count/limit);
        page = Math.min(page,pages);
        //sort()排序，1：升序；-1：降序；
        Category.find().sort({_id:-1,}).skip(skip).limit(limit).then(function (result) {
            res.render('admin/category_index',{
                userInfo:req.userInfo,
                categories:result,
                page:page,
                pages:pages,
                count:count,
                limit:limit,
            })
        });
    })
});
//添加分类
router.get('/category/add',function(req,res,next){
    res.render('admin/category_add',{
        userInfo:req.userInfo,
    })
});
//分类保存
//后面再用ajax重写
router.post('/category/add',function(req,res,next){
    var name = req.body.name||'';
    //输入不能为空
    if(name==''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            lastIndex:'分类管理',
            msg:'名称不能为空',
            url:'admin/category',
        });
        //res.end();
    }
    else
    {
        //数据库中不能已存在
        Category.findOne({
            name: name,
        }).then(function (rs) {
            if (rs) {
                //数据库中已经存在同名分类名称
                res.render('admin/error', {
                    userInfo: req.userInfo,
                    lastIndex:'分类管理',
                    msg: '分类已经存在',
                    url:'admin/category',
                });
                return Promise.reject();
            }
            else {
                new Category({name: name,}).save();
            }
        }).then(function (newCategory) {
            res.render('admin/success', {
                userInfo: req.userInfo,
                msg: '分类保存成功',
                url: '/admin/category',
                lastIndex:'分类管理',
                backUrl:'/admin/category',
            })
        }).catch(function (error) {
                console.log('caught', error.message)
            }
        );
    }
});
//分类修改
router.get('/category/edit',function (req,res,next) {
    //获取要修改的分类信息，并以表单的形式展示出来
    var id = req.query.id||'';
    //获取要修改的分类信息
    Category.findOne({_id:id,})
        .then(function(category){
            if(!category){
                res.render('admin/error', {
                    userInfo: req.userInfo,
                    lastIndex:'分类管理',
                    url:'admin/category',
                    msg: '分类不存在',
                });
                return Promise.reject();
            }else{
                res.render('admin/category_edit', {
                    userInfo: req.userInfo,
                    category: category,
                });
            }
        })
});
//分类的修改保存
router.post('/category/edit',function (req,res,next) {
    //获取要修改的分类信息，并以表单的形式展示出来
    var id = req.query.id||'';
    var name = req.body.name || '';
    //获取要修改的分类信息
    Category.findOne({_id:id,})
        .then(function(category){
            if(!category){
                res.render('admin/error', {
                    userInfo: req.userInfo,
                    lastIndex:'分类管理',
                    url:'admin/category',
                    msg: '分类不存在',
                });
                return Promise.reject();
            }else{
                //当用户未做任何修改提交时
                if(name === category.name){
                    res.render('admin/success', {
                        lastIndex:'分类管理',
                        userInfo: req.userInfo,
                        msg: '修改成功',
                        url: '/admin/category',
                        backUrl:'/admin/category',
                    });
                    return Promise.reject();
                }
                //要修改的名称数据库中是否存在
                else{
                    Category.findOne({
                        _id:{$ne:id},
                        name:name,
                    }).then(function (sameCategory) {
                        if(sameCategory){
                            res.render('admin/error', {
                                lastIndex:'分类管理',
                                url:'admin/category',
                                userInfo: req.userInfo,
                                msg: '数据库中已存在同名的分类',
                            });
                            return Promise.reject();
                        }else{
                            return Category.update({
                                _id:id,
                            }, {
                                name:name,
                            })
                        }
                    }).then(function () {
                        res.render('admin/success', {
                            lastIndex:'分类管理',
                            userInfo: req.userInfo,
                            msg: '修改成功',
                            url:'/admin/category',
                            backUrl:'/admin/category',
                        });
                    })
                }
            }
        })
    
});
//分类删除
router.get('/category/delete',function (req,res,next) {
    var id = req.query.id||'';
    Category.remove({
        _id:id,
    }).then(function (rs) {
        res.render('admin/success', {
            lastIndex:'分类管理',
            userInfo: req.userInfo,
            msg: '删除成功',
            url: '/admin/category',
            backUrl: '/admin/category',
        });
    }).catch()
});

/*
* 内容首页
* */
router.get('/content',function(req,res,next){

    var page = Number(req.query.page || 1);
    var number = 10;
    var pages = 0;

    Content.count().then(function (count) {
        //向上取整，计算存在的页数
        pages = Math.ceil(count/number);
        //用户传过来的页数不能多于存在的页数
        page = Math.min(page,pages);
        page = Math.max(page,1);

        //populate是找到该关联的字段，然后在相关联的表中(在相对应的表结构中定义)
        Content.find().sort({_id:-1}).populate(['category','user']).limit(number).skip((page-1)*number).then(function (contents) {
            res.render('admin/content_index',{
                userInfo:req.userInfo,
                contents:contents,
                page:page,
                pages:pages
            });
        });
    });
});
//内容添加
router.get('/content/add',function(req,res,next){
    Category.find().then(function (categories) {
        res.render('admin/content_add',{
            userInfo: req.userInfo,
            categories:categories,
        })
    })
});
router.post('/content/add',function(req,res,next){
    //验证分类和标题不能为空
    if(req.body.category==''){
        res.render('admin/error', {
            lastIndex:'内容管理',
            userInfo: req.userInfo,
            msg: '分类内容不能为空',
            url: '/admin/content',
        });
    }
    else if(req.body.title==''){
        res.render('admin/error', {
            lastIndex:'内容管理',
            userInfo: req.userInfo,
            msg: '内容标题不能为空',
            url: '/admin/content',
        });
    }
    //验证成功保存到数据库中
    else {
        new Content({
            user: req.userInfo._id.toString(),
            category: req.body.category,
            title: req.body.title,
            description: req.body.description,
            content: req.body.content,
        }).save().then(function (rs) {
            res.render('admin/success', {
                userInfo: req.userInfo,
                lastIndex: '内容管理',
                msg: '内容保存成功',
                url: '/admin/content',
                backUrl:'/admin/content',
            });
        })
    }
});
//内容修改
router.get('/content/edit',function(req,res,next){
    var id = req.query.id||'';
    var categories;
    Category.find().then(function (rs) {
        categories=rs;
    });
    Content.findOne({_id:id}).then(function (rs) {
        res.render('admin/content_edit',{
            categories:categories,
            userInfo:req.userInfo,
            content:rs,
        })
    });
});

router.post('/content/edit',function (req,res) {
    var id = req.query.id||'';
    Content.update({_id:id},{
        $set:{
            category:req.body.category,
            title:req.body.title,
            description:req.body.description,
            content:req.body.content
        }
    }).then(function(info){
        if(info.ok){
            res.render('admin/success',{
                lastIndex:'内容管理',
                userInfo:req.userInfo,
                msg:'修改成功',
                url:'/admin/content',
                backUrl:'/admin/content',
            })
        }
    })
});
//内容删除
router.get('/content/delete',function(req,res,next){
    var id = req.query.id||'';
    Content.remove({
        _id:id,
    }).then(function (rs) {
        res.render('admin/success', {
            lastIndex:'内容管理',
            userInfo: req.userInfo,
            msg: '删除成功',
            url: '/admin/content',
            backUrl:'/admin/content',
        });
    }).catch()
});

/*
* 显示用户列表
* 
* */

router.get('/user',function(req,res,next){   //不需要再写/admin /user是跟在/admin后的

    var page = req.query.page||1;
    var limit = 20 ;
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

});

module.exports = router;
