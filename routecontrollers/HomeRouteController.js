HomeRouteController = RouteController.extend({
	template:'homeLayout'
});

Router.route('/home',{
	controller:'HomeRouteController'
});