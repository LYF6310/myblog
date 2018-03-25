$(document).ready(function(){
  $("#login .close").click(function(){
    $("#login").hide();
  });
  $("#reg .close").click(function(){
    $("#reg").hide();
  });
  $(".login").click(function(){
    $("#login").show();
  });
  $(".reg").click(function(){
    $("#reg").show();
  });

    var $login = $('#login')
    var $register = $('#reg')
    var $userInfo = $('#userInfo')

    $register.find('.other').on('click',function(){
        $login.show();
        $register.hide();
    })
  $register.find('.submit').on('click',function(){
    $.ajax({
      type:'post',
      url:'/api/user/register',
      data:{
        username:$register.find('input')[0].value,
        password:$register.find('input')[1].value,
        repassword:$register.find('input')[2].value,
      },
      dataType:'json',
      success:function(result){
        console.log(result)
        $register.find('#reminder').show().find('span').html(result.message)
        if(!result.code){
          setTimeout(function(){
            $login.show()
            $register.hide()
          },1000)
        }
      }
    })
  })

  $login.find('.submit').on('click',function(){
      console.log("anxia");
    $.ajax({
        type:'post',
        url:'/api/user/login',
        data:{
            username:$login.find('input')[0].value,
            password:$login.find('input')[1].value,
        },
        dataType:'json',
        success:function(result){
            console.log(result)
            $login.find('.reminder').html(result.message)
            if(!result.code){
                setTimeout(function(){
                    $userInfo.show()
                    $userInfo.find('.user').html(result.userInfo.username)
                    $login.hide()
                    $register.hide()
                    window.location.reload();
                },1000)
            }
        }
    })
  })
    
    $('#logout').on('click',function () {
        $.ajax({
            url:'/api/user/logout',
            success:function (result) {
                if(!result.code){
                    window.location.reload();
                }
            }
        })
    })
});
