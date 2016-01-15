Template.threeWordLayout.helpers({
    isMenuPage: function() {
        if(Template.currentData()) {
            return false;
        } else {
            return true;
        }
    }
});

Template.threeWordStoryBody.helpers({
    newPara: function() {
        return this.newPara;
    },
    segmentInfo: function() {
        var result = {}
        if(Template.currentData() && Session.get('segmentId')) {
            result.timestamp = {};
            result.author = Meteor.users.findOne(Template.currentData().story[Session.get('segmentId') - 1].author).username;
            result.timestamp.date = moment(Template.currentData().story[Session.get('segmentId') - 1].dateModified).format('ll');
            result.timestamp.time = moment(Template.currentData().story[Session.get('segmentId') - 1].dateModified).format('LTS');
        }
        return result;
    },
    isOptions: function() {
        return Session.get('isOptions');
    }
});

Template.threeWordStoryBody.events({
    'keyup #3word-segmentContent': function(evt, template) {
        evt.preventDefault();
        var value = evt.currentTarget.value;
        value = threeWord_tokenizeString(value);
        if(evt.currentTarget.value.split(' ').length > 3) {
            evt.currentTarget.value = value;
        }
        template.find('#3wordstory-preview').innerHTML = threeWord_makeSafeString(value);
    },
    'change #3word-newPara': function(evt, template) {
        var result = evt.currentTarget.checked;

        if(result) {
            $('.previewBr').show(0, function() {
                $('#storyPanel').scrollTop($('#storyPanel').prop('scrollHeight'));
            });
        } else {
            $('.previewBr').hide();
        }
    },
    'submit': function(evt, template) {
        evt.preventDefault();
        var value = template.find('#3word-segmentContent').value;
        var newPara = template.find('#3word-newPara').checked;
        var storyId = Template.currentData()._id;
        template.find('#3word-segmentContent').value = "";
        template.find('#3wordstory-preview').innerHTML = "";
        template.find('#3word-newPara').checked = false;
        $('.previewBr').hide();
        Meteor.call('addStorySegment', storyId, value, newPara);
    },
    'mouseenter .threeWord-storySegment': function(evt, template) {
        evt.currentTarget.classList.add('highlight');
        Session.set('isOptions', false);
        Session.set('segmentId', evt.currentTarget.getAttribute('data-index'));
    },
    'mouseleave .threeWord-storySegment': function(evt, template) {
        evt.currentTarget.classList.remove('highlight');
        Session.set('isOptions', true);
        Session.set('segmentId', undefined);
    }

});

Template.threeWordStoryBody.onRendered(function() {
    ThreeWord.find(Template.currentData()._id).observeChanges({
        changed: function(id, fields) {
            if(Session.get('autoScroll')) {
                $('#storyPanel').scrollTop($('#storyPanel').prop('scrollHeight'));
            }
        }
    });
});

Template.threeWordStoryBodyOptionsBox.helpers({
    autoScrollButton: function() {
        var result = {};
        if(Session.get('autoScroll')) {
            result.style = 'success';
            result.icon = 'check-circle-o';
            result.text = 'Enabled';
        } else {
            result.style = 'warning';
            result.icon = 'times-circle-o';
            result.text = 'Disabled';
        }
        return result;
    }
});

Template.threeWordStoryBodyOptionsBox.events({
    'click #threeWordAutoScroll': function(evt, template) {
        evt.preventDefault();
        Session.set('autoScroll', !Session.get('autoScroll'));
    }
});

Template.threeWordStoryBodyActionBox.helpers({
    removeStoryClass: function() {
        if(Template.currentData().owner === Meteor.user()._id) {
            return 'danger';
        } else {
            return 'default disabled';
        }
    },
    removeLastMsgButtonClass: function() {
        var lastIndex = Template.currentData().story.length - 1;
        if(Template.currentData().story.length !== 0 &&
            (Template.currentData().story[lastIndex].author === Meteor.user()._id ||
           Template.currentData().owner === Meteor.user()._id) ) {
            return "warning";
        } else {
            return "default disabled";
        }
    }
});

Template.threeWordStoryBodyActionBox.events({
    'click #threeWord-deleteLastMsg': function(evt, template) {
        evt.preventDefault();
        Meteor.call('deleteStorySegment', Template.currentData()._id);
    }
});

Template.threeWordStoryBodyActionBoxModal.events({
    'click #threeWordDeleteStoryCancel': function(evt, template) {
        $('.threeWordStoryBodyActionBoxModal').modal('hide');
    },
    'click #threeWordDeleteStoryConfirm': function(evt, template) {
        var storyId = Template.currentData()._id;
        $('.threeWordStoryBodyActionBoxModal').one('hidden.bs.modal', function(e) {
            Meteor.call('deleteStory', storyId);
            Router.go('/3word');
        });
        $('.threeWordStoryBodyActionBoxModal').modal('hide');
    }
});

Template.threeWordLayout.events({
    'click .btn#3wordlayout_backToMenu': function(evt, template) {
        evt.preventDefault();
        Router.go('/3word');
    },
    'click .btn#3wordlayout_newStory': function(evt, template) {
        evt.preventDefault();
        $('#threeWordNewEntryModal').one('shown.bs.modal', function(e) {
            $('input#3word-title').focus();
        });
        $('#threeWordNewEntryModal').modal('show');
    }
});

Template.threeWordNewEntryModal.events({
    'submit, click .btn': function(evt, template) {
        evt.preventDefault();
        var title = template.find('input#3word-title').value;
        var plotGuide = template.find('textarea#3word-plotguide').value;
        //checks for validity START
        //checks for validity END

        Meteor.call('createStory', title, plotGuide, function(err, res) {
            if(!err) {
                template.find('input#3word-title').value = "";
                template.find('textarea#3word-plotguide').value = "";
                $('#threeWordNewEntryModal').one('hidden.bs.modal', function(e) {
                    Router.go('/3word/' + res);
                });
                $('#threeWordNewEntryModal').modal('hide');
            }
        });
    }
});

Template.threeWordMenuBody.helpers({
    storyRows: function() {
        var latestFirstArray = ThreeWord.find({}, {
            sort: {
                dateCreated: -1
            }
        }).fetch();
        var noOfRows = Math.ceil(latestFirstArray.length / 3);
        var result = [];
        for(var i = 0; i < noOfRows; i++) {
            result.push(latestFirstArray.splice(0, 3));
        }
        return result;
    }
});

Template.threeWordMenuPanel.helpers({
    notOne: function(number) {
        if(number === 1) {
            return " contribution";
        } else {
            return " contributions";
        }
    },
    timeAgo: function(dateModified) {
        return moment(dateModified).from(moment());
    }
});

Template.threeWordMenuPanel.events({
    'click .btn': function(evt, template) {
        evt.preventDefault();
        var id = evt.currentTarget.getAttribute('id');
        Router.go('/3word/' + id);
    }
});

Template.threeWordNewEntryModal.events({
    'keyup #3word-title': function(evt, template) {
        // enforce length restriction
        if(evt.currentTarget.value.length > 40) {
            evt.currentTarget.value = evt.currentTarget.value.substr(0, 40);
        }
    }
});

