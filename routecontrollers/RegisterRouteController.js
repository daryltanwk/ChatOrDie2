RegisterController = RouteController.extend({
    template: 'RegisterLayout'
});

Router.route('/register', {
    controller: 'RegisterController',
    name: 'register',
    onStop: function() {
        //Reset the Session variables used in the route
        Session.set('registerUsernameCharCount', undefined);
        Session.set('registerUsernameValid', undefined);
        Session.set('registerPasswordValid', undefined);
    }
});
