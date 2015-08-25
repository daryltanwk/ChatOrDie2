//========== MISC Publications ========== START

Meteor.publish(null, function() {
    if (!this.userId) {
        return null;
    }

    var result = Messages.find({
        recipient: {
            $in: ['global', this.userId]
        }
    }, {
        sort: {
            index: -1
        },
        limit: 10
    });

    return result;
});

Meteor.publish(null, function() {
    var result = Meteor.users.find({}, {
        fields: {
            profile: 1,
            "status.online": 1,
            username: 1
        }
    });

    return result;
})

//========== MISC Publications ========== END

//========== MISC Methods ========== START

//========== MISC Methods ========== END
