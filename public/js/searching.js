var socket = io();

const inputSearchContact = jQuery("#contact_search");

inputSearchContact.keyup(function(e) {
  if (e.which == 13 ) {
     e.preventDefault();
  }
  socket.emit('getContacts',{search: $(this).val()});
});

socket.on('responseResearch', function(res){
  var templateContact = jQuery('#contact-search-template').html();
  var ul = document.getElementById('contacts-list');
  while (ul.firstChild) {
      ul.removeChild(ul.firstChild);
  }
  res.forEach(function(contact){
    var li = jQuery('<li class="contact"><div class="contact-img"><img src="img/640x640.png" alt="contact-img"></div><div class="info"><p class="contact-name" id="contact-name">'+contact.username+'</p></div></li>');
    jQuery('#contacts-list').append(li);
  });
});

$(document).ready(function(){
  console.log(jQuery('#contact-name').html());
});
