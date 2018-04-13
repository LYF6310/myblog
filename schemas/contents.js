var mongoose = require('mongoose');
//内容的表结构
module.exports = new mongoose.Schema({
    //内容标题
    title: String,
    //关联字段 - 分类信息
    category:{
        //类型
        type:mongoose.Schema.Types.ObjectId,
        //引用
        ref:'Category',
    },
    //作者
    user:{
        //类型
        type:mongoose.Schema.Types.ObjectId,
        //引用
        ref:'User',
    },
    //添加时间
    addTime:{
        type:Date,
        default:new Date(),
    },
    //阅读量
    views:{
        type:Number,
        default:0,
    },
    //简介
    description:{
        type:String,
        default:'',
    },
    //内容
    content:{
        type:String,
        default:'',
    },
    //评论
    comments:{
        type:Array,
        default:[],
    },
});