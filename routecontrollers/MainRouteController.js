Router.configure({
    notFoundTemplate: 'notFoundPage'
});

MainController = RouteController.extend({
    action: function() {
        if (Meteor.loggingIn()) {
            this.render('loadingPage');
        } else if (Meteor.user()) {
            Router.go('/home');
        } else {
            this.render('loginPanel');
        }
    }
});

Router.route('/', {
    name: 'root',
    controller: 'MainController'
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

Router.onRun(function() {
    var animationList = ['bounceInLeft', 'bounceInRight'];
    var random = Math.floor(Math.random() * 2)
    $('#router').addClass('animated ' + animationList[random]);
    $('#router').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
        $('#router').removeClass();
    });
    this.next();
});
