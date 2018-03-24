//应用程序的启动（入口）文件

var express = require('express');
//加载模版处理模块
var swig = require('swig');
//加载数据库模块
var mongoose = require('mongoose')
//加载body-parser，用来处理post提交的数据
var bodyParser = require('body-parser');
//加载cookies模块
var cookies = require('cookies');
//app => NodeJS  Http.createServer()
var app = express();



//设置静态文件托管
//当用户访问的url 以/public开始，那么直接返回对于__dirname + '/public'下的文件
app.use('/public',express.static(__dirname + '/public'));

//配制应用模版
//定义当前所使用的模版引擎
//第一个参数：模版引擎的名称，同时也是模版文件的后缀；第二个参数表示用于解析处理模版内容的方法
app.engine('html',swig.renderFile);
//设置模版文件存放的目录，第一个参赛必须是views，第二个参数是目录
app.set('views','./views');
//注册所使用的模版引擎，第一个参数必须是view engine ，第二个参数和app.engine这个方法中定义的模版引擎的名称（第一个参赛）必须相同
app.set('view engine','html')
//在开发过程中，需要取消模版缓存,方便开发过程中的调试
swig.setDefaults({cache:false});

//
app.use(bodyParser.urlencoded({extended:true}));

app.get('/public/css/index.css',function(req,res,next){
    res.setRequestHeader('conten-type','text/css');
    res.send("body{background: blue;}")
})
// //next 函数
// app.get('/',function(req,res,next){
//   //res.send('欢迎光临我的blog！')
//   //读取views目录下颚指定文件，解析并返回给客户端
//   //第一个参赛：表示模版的文件，相对于views目录  Views/index.html
//   //第二个参数：传递给模版使用的数据
//   res.render()
// })；


//根据不同功能划分模块（后台、API、首页）
app.use('/admin',require('./routers/admin'))
app.use('/api',require('./routers/api'))
app.use('/',require('./routers/main'))

mongoose.connect('mongodb://localhost:27018/myBlog',function(err){
    if(err){
        console.log('数据库连接失败'+err)
    }else{
        console.log('数据库连接成功！')
        app.listen('8080',function(){
            console.log('listening...')
        });
    }
});




// app.get('/',function(req,res,next){
//     res.send('Main')
// })
//用户发送http请求 -> url -> 解析路由 -> 找到匹配规则 -> 执行指定的绑定函数，返回对应内容至用户

//  /public -> 静态 -> 直接读取指定目录下的文件，返回给用户
//  ->动态 -> 加载处理业务逻辑，加载模版，解析模版 -> 返回数据给用户
