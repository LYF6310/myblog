var page = page||1;
var pages = 0;
var start = 0;
var limit = 4;
var _comments = [];

$(document).ready(function(){
    $.ajax({
        type:'post',
        url:'/api/comments',
        data:{
            contentid: $('#connentId').val(),
            content: $('#msgComment').val(),
        },
        success:function (responseData) {
            renderComment(responseData.comments.reverse());
            _comments = responseData.comments;
            pages = Math.ceil(responseData.comments.length/limit);
            $('#pager p').html(page+'/'+pages);
            if(page==pages){
                $('#pager .next').addClass("disabled");
            }
        }
    });
    $('#pager .previous').addClass('disabled');
});

$('#postComment').on('click',function () {
    $.ajax({
        type: 'post',
        url:'/api/comment/post',
        data:{
            contentid: $('#connentId').val(),
            content: $('#msgComment').val(),
        },
        success:function (responseData) {
            $('#msgComment').val('');
            renderComment(responseData.data.comments.reverse());
            _comments = responseData.data.comments;
            pages = Math.ceil(responseData.data.comments.length/limit);
        }
    })
});

$('#pager .previous').on('click',function () {
    if(!$('#pager .previous').hasClass("disabled")) {
        $('#pager .next').removeClass('disabled');
        page -= 1;
        if(page==1){
            $('#pager .previous').addClass("disabled");
        }start = start-limit;
        $('#pager p').html(page + '/' + pages);
        renderComment(_comments);
    }
});

$('#pager .next').on('click',function () {
    if(!$('#pager .next').hasClass("disabled")) {
        $('#pager .previous').removeClass('disabled');
        page += 1;
        if(page==pages){
            $('#pager .next').addClass("disabled");
        }
        start = start + limit;
        $('#pager p').html(page + '/' + pages);
        renderComment(_comments);
    }
});

function transformTime(time) {
    var date = new Date(time);
    return date.getFullYear() +'年'+(date.getMonth()+1)+'月'+date.getDate()+"日 "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
};

function renderComment(comments) {
    var html='';
    currentComments = comments.slice(start,(start+limit));
    for(i in currentComments){
        var commentTime = transformTime(currentComments[i].postTime);
        html += '<li class="list-group-item">\n' +
            '                    <span >'+currentComments[i].content+'</span>\n' +
            '                    <span style="float:right;">&nbsp; - &nbsp;'+commentTime+'</span>\n' +
            '                    <span class="badge" style="float:right;">'+currentComments[i].username+'</span>\n' +
            '\n' +
            '                </li>';
    }
    $('#commentsNum').html(comments.length);
    $('#commentList').html(html);
}





