Template.homeLayout.helpers({
    msgs: function() {
        return Messages.find({}, {
            sort: {
                index: 1
            }
        });
    },
    onlineUsers: function() {
        return Meteor.users.find({
            _id: {
                $ne: Meteor.user()._id
            },
            "status.online": true
        });
    }
});

Template.chatBubble.helpers({
    name: function(userId) {
        if (!userId) {
            return 'Anon';
        } else {
            return Meteor.users.findOne({
                _id: userId
            }).username;
        }
    },
    tStamp: function(date) {
        return moment(date).format('DD/MM/YYYY, HH:mm');
    },
    fromMeBubble:function(userId) {
        if(Meteor.user().username === Meteor.users.findOne({_id:userId}).username){
            return 'text-right';
        }else {
            return false;
        }
    },
    bubbleColor:function(userId){
        if(Meteor.user().username === Meteor.users.findOne({_id:userId}).username){
            return 'Wheat';
        }else {
            return 'AliceBlue';
        }
    }
});

Template.homeLayout.rendered = function() {
    Messages.find().observeChanges({
        added: function(id, fields) {
            $('#' + id).toggleClass('hidden animated fadeIn');
            $('#' + id).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
                $('#' + id).removeClass('hidden animated fadeInRight');
            });
        }
    });

    Template.instance().autorun(function() {
        var messy = Messages.find().fetch();
        $('#chatPanel').scrollTop($('#chatPanel').prop('scrollHeight'));
    });
};

//========== EVENT LISTENERS ========== START

Template.homeLayout.events({
    'submit': function(evt, template) {
        evt.preventDefault();
        Meteor.call('sendMsg', 'global', $('#chatInput')[0].value);
        $('#chatInput')[0].value = '';
    }
});

//========== EVENT LISTENERS ========== END
