MainController = RouteController.extend({});

Router.route('/', {
    template: 'loginPanel',
    name: 'root'
});

Router.onBeforeAction(function() {
    if (Meteor.loggingIn()) {
        //Render the 'loadingPage' template
        this.render('loadingPage');
    } else if (Meteor.user()) {
        //Carry on, nothing to do here.
        this.next();
    } else {
    	//Sorry no access, go back to your roots!
        Router.go('/');
    }
}, {
    except: ['register', 'root']
});
