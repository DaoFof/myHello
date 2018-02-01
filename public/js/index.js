const signupform = jQuery('#signupform');
const loginform =  jQuery('#loginform');

signupform.on('submit', function(e){
  e.preventDefault();
  const userInfo = {
    username: jQuery('[name=user]').val(),
    email: jQuery('[name=email]').val(),
    password: jQuery('[name=passwrd]').val(),
    post: 'signup'
  };
  console.log(JSON.stringify(userInfo, undefined, 2));
  $.ajax({
        type: "POST",
        url: 'http://localhost:3000/',
        data: userInfo,
        success: function(data) {
          console.log('success');
          console.log(data.token);
          localStorage.setItem('token', data.token);
          token("/home");
        },
        error: function(jqXHR, textstatus, errorThrown) {
            console.log('text status ' + textstatus + ', err ' + errorThrown);
            console.log(JSON.parse(jqXHR.responseText));
        }
    });

});

loginform.on('submit', function(e){
  e.preventDefault();
  const userInfo = {
    username: jQuery('[name=username]').val(),
    password: jQuery('[name=password]').val(),
    post: 'signin'
  };
  console.log(JSON.stringify(userInfo, undefined, 2));
  $.ajax({
        type: "POST",
        url: 'http://localhost:3000/',
        data: userInfo,
        success: function(data) {
          console.log('success');
            console.log(data.token);
            var status;
            localStorage.setItem('token', data.token);
            token("/home");
        },
        error: function(jqXHR, textstatus, errorThrown) {
          console.log('text status ' + textstatus + ', err ' + errorThrown);
          console.log(JSON.parse(jqXHR.responseText));
        }
    });
});

jQuery('#signupbtn').click(function(){
  $('#loginbox').hide('slow');
  $('#signupbox').show('fast');
});
jQuery('#signinbtn').click(function(){
  $('#signupbox').hide('fast');
  $('#loginbox').show('slow');
});
$(document).ready(function(){
  jQuery('[name=username]').focus();
  var signupbtn = jQuery('#signinbtn');
});
