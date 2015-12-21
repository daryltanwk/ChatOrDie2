Template.threeWordLayout.helpers({
    isMenuPage: function() {
        if (Template.currentData()) {
            return false;
        } else {
            return true;
        }
    }
});

Template.threeWordStoryBody.helpers({
    newPara: function() {
        return this.newPara;
    }
});

Template.threeWordStoryBody.events({
    'keyup #3word-segmentContent': function(evt, template) {
        evt.preventDefault();
        var value = evt.currentTarget.value;
        value = threeWord_tokenizeString(value);
        if (evt.currentTarget.value.split(' ').length > 3) {
            evt.currentTarget.value = value;
        }
        template.find('#3wordstory-preview').innerHTML = threeWord_makeSafeString(value);
    },
    'change #3word-newPara': function(evt, template) {
        var result = evt.currentTarget.checked;

        if (result) {
            $('.previewBr').attr('hidden', false);
        } else {
            $('.previewBr').attr('hidden', true);
        }
    },
    'submit': function(evt, template) {
        evt.preventDefault();
        var value = template.find('#3word-segmentContent').value;
        var newPara = template.find('#3word-newPara').checked;
        var storyId = Template.currentData()._id;
        template.find('#3word-segmentContent').value = "";
        template.find('#3wordstory-preview').innerHTML = "";
        Meteor.call('addStorySegment', storyId, value, newPara);
    }
    // ,
    // 'mouseenter .3word-storySegment': function(evt, template) {
    //     evt.currentTarget.setAttribute('style', 'color:red; font-weight:bold; font-size:2em;');
    //     console.log('trigger');
    // },
    // 'mouseleave .3word-storySegment': function(evt, template) {
    //     evt.currentTarget.setAttribute('style', null);
    //     console.log('trigger no');
    // }
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
            if (!err) {
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
        for (var i = 0; i < noOfRows; i++) {
            result.push(latestFirstArray.splice(0, 3));
        }
        return result;
    }
});

Template.threeWordMenuPanel.helpers({
    notOne: function(number) {
        if (number === 1) {
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
        if (evt.currentTarget.value.length > 40) {
            evt.currentTarget.value = evt.currentTarget.value.substr(0, 40);
        }
    }
});
