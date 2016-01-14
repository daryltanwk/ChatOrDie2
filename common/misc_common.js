//========== Mongo Collections ========== START

Messages = new Mongo.Collection('messages');

//========== Mongo Collections ========== END

//========== Methods ========== START

Meteor.methods({
    sendMsg: function(recipient, content) {
        //Check if client is logged in
        if(!this.userId) {
            throw misc_error_003;
        }

        //Check recipient/content is valid
        if(recipient !== "global" && Meteor.users.find({
                _id: recipient
            }).count() === 0) {
            throw misc_error_001;
        } else if(!Match.test(content, String) || content === '') {
            throw misc_error_002;
        }

        //Create the message object
        var sentAt = new Date();
        var index = Messages.find().count() + 1;
        var sender = this.userId;

        var msg = new Message(content, recipient, sender, sentAt, index);

        //Insert the message
        if(Meteor.isServer) {
            return Messages.insert(msg);
        } else if(Meteor.isClient) {
            Messages.insert(msg);
            $('#chatPanel').scrollTop($('#chatPanel').prop('scrollHeight'));
        }
    }
});

//========== Methods ========== END

//========== Prototypes ========== START

Message = function(content, recipient, sender, sentAt, index) {
    this.content = content;
    this.recipient = recipient;
    this.sender = sender;
    this.sentAt = sentAt;
    this.index = index;
};

//========== Prototypes ========== END

