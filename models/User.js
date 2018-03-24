var mongoose = require('mongoose');
var userSchema = require('../schemas/users');
//创建操作Schema的模型
module.exports = mongoose.model('User',userSchema);
