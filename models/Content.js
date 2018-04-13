var mongoose = require('mongoose');
var contentsSchema = require('../schemas/contents');
//创建操作Schema的模型
module.exports = mongoose.model('Content',contentsSchema);