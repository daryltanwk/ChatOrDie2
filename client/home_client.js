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


function isUrl(string) {
    return new RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?").test(string);
}

Template.contentRenderer.helpers({
    renderText: function(content) {
        var strArr = content.split(" ");

        var res = "";

        _.each(strArr, function(str, index) {
            if(index != 0) {
                res += " ";
            }

            if (isUrl(str)) {
                res += "<a href=\"";
                if (str.indexOf("http") > -1) {
                    //if it already gt http, do nothing
                } else {
                    res += "http://";
                }

                res += str + "\"" + " target=\"_blank\" " +       ">"  + str + "</a>";
                
            } else {
                res += str;
            }
        });

        return res;
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
