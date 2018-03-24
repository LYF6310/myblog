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

  $login.find(".submit").on('click',function(){
      console.log("anxia")
      $login.hide()
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


});
