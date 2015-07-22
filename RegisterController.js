RegisterController = RouteController.extend({
    layoutTemplate: 'RegisterLayout'
});

Router.route('/register', {
    controller: 'RegisterController'
});
