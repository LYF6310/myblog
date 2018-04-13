var mongoose = require('mongoose');
var categorySchema = require('../schemas/category');
//创建操作Schema的模型
module.exports = mongoose.model('Category',categorySchema);