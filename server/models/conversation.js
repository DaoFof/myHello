const mongoose = require('mongoose');

var ConversationSchema = new mongoose.Schema({
  participants: [{
    user:{
      type: String
    }
  }],
  messages:[{
    message:{
      sender:{
        type: String,
        require: true
      },
      content:{
        type: String,
        require: true
      },
      recipient: {
        type: String,
        require: true
      },
      time_created:{
        type: Date,
        default: Date.now
      }
    }
  }]
});

/* create a:
 -UserSchema.methods.fetchLastFiftyMsg

*/
ConversationSchema.methods.fetchLastFiftyMsg = async function(span){
  var conversation = this;
  return messages = await conversation.find().sort({_id: 1}).skip(span).limit(50);
}

var Conversation = mongoose.model('Conversation', ConversationSchema);

module.exports = {Conversation};
