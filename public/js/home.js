const messages = jQuery("#list_messages");
const contacts = jQuery("#list_contacts");
const sectionMsg = jQuery("#option_message_content");
const sectionContact =  jQuery("#option_contact_content");

messages.on('click', function(e){
  sectionContact.css('display', 'none'); //hide the section
  sectionMsg.removeAttr( 'style' );//show the section
  $("li").removeClass('current');
  $(this).addClass('current');
});
contacts.on('click', function(e){
  sectionMsg.css('display', 'none');
  sectionContact.removeAttr( 'style' );
  $("li").removeClass('current');
  $(this).addClass('current');
});

$(document).ready(function(){
  sectionContact.css('display', 'none'); //hide the section
});
