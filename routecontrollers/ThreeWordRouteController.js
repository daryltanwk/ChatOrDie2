ThreeWordController = RouteController.extend({
    waitOn: function() {
        return Meteor.subscribe('allStories');
    },
    action: function() {
        if (this.ready()) {
            this.render();
        } else {
            this.render('loadingPage', {
                to: 'threeWordBody'
            });
        }
    }

});

Router.route('/3word', {
    controller: 'ThreeWordController',
    layoutTemplate: 'threeWordLayout',
    yieldRegions: {
        'threeWordMenuBody': {
            to: 'threeWordBody'
        }
    },
    name: '3word'
});

Router.route('/3word/:storyId', {
    controller: 'ThreeWordController',
    name: '3wordStory',
    data: function() {
        //Return the Story to Render
        return ThreeWord.findOne(this.params.storyId);
    },
    action: function() {
        if (!this.data()) {
            this.render('notFoundPage');
        } else {
            this.render('threeWordLayout');
            this.render('threeWordStoryBody', {
                to: 'threeWordBody'
            })
        }
    }
});
