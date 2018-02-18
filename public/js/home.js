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
  const inputSearchContact = jQuery("#contact_search");
  inputSearchContact.keyup(function(e) {
    if (e.which == 13 ) {
       e.preventDefault();
    }
    $.ajax({
          type: "POST",
          url: 'http://localhost:3000/getContacts',
          data: {
            search: $(this).val()
          },
          success: function(data) {
            console.log('success');
            // console.log(data.token);
            // localStorage.setItem('token', data.token);
            // token("/home");
          }
          //,
          // error: function(jqXHR, textstatus, errorThrown) {
          //     console.log('text status ' + textstatus + ', err ' + errorThrown);
          //     console.log(JSON.parse(jqXHR.responseText));
          // }
      });
  });
});
