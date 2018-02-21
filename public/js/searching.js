var socket = io();

const inputSearchContact = jQuery("#contact_search");

function cleanul(){
  var ul = document.getElementById('contacts-list');
  while (ul.firstChild) {
      ul.removeChild(ul.firstChild);
  }
};
inputSearchContact.keyup(function(e) {
  if (e.which == 13 ) {
     e.preventDefault();
  }
  socket.emit('getContacts',{search: $(this).val()});
});


socket.on('responseResearch', function(res){
  cleanul();
  res.forEach(function(contact){
    if(contact.username!=$('#user-header p').html()){
      var li = jQuery('<li class="contact"><div class="contact-img"><img src="img/640x640.png" alt="contact-img"/></div><div class="info"><p class="contact-name name" id="contact-name">'+contact.username+'</p><i href='+contact._id+' class="fa fa-user-plus"></i></div></li>');
      jQuery('#contacts-list').append(li);
    }
  });
});

$('body').on('click','.fa-user-plus',function(e){
  $(this).addClass('clicked');
  socket.emit('sendRequest',{add: $(this).attr('href'), token: localStorage.getItem('token').toString()}, function(err){
    if(err){
      $('.clicked').removeClass('fa-user-plus').addClass('fa-exclamation-circle');
      setTimeout(function(){
        $('.clicked').removeClass('fa-exclamation-circle clicked').addClass('fa-user-plus');
      },3000);
    }else{
        $('.clicked').removeClass('fa-user-plus clicked').addClass('fa-check');
    }
  });
});

$('#request').on('click',function(e){
  socket.emit('seeRequest',{token: localStorage.getItem('token').toString()});
});

socket.on('responseSeeRequest',function(res){
  cleanul();
  res.forEach(function(requester){
    var li = jQuery('<li class="contact"><div class="contact-img"><img src="img/640x640.png" alt="contact-img"/></div><div class="info"><p class="contact-name name">'+requester.name+'</p><div><i href='+requester.requesterId+' class="fa fa-handshake"></i><i href='+requester.requesterId+' class="fa fa-times"></i></div></div></li>');
    jQuery('#contacts-list').append(li);
  });
});
$('body').on('click', '.fa-handshake', function(e){
  $(this).addClass('clicked');

  socket.emit('acceptRequest',{add: $(this).attr('href'),name:$(this).parent().siblings('.name').html(), token: localStorage.getItem('token').toString()}, function(err){
    if(err){
      $('.clicked').removeClass('fa-handshake').addClass('fa-exclamation-circle');
      setTimeout(function(){
        $('.clicked').removeClass('fa-exclamation-circle clicked').addClass('fa-handshake');
      },3000);
    }else{
        $('.clicked').removeClass('fa-handshake clicked').addClass('fa-check');
        jQuery('.fa-check').parents('li').hide('slow', function(){
          jQuery('.fa-check').remove();
        });
    }
  })
});
