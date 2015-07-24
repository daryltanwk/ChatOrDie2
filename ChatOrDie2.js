if (Meteor.isClient) {
    Template.loginPanel.events({
        'click #loginToRegister': function(evt, template) {
            evt.preventDefault();
            Router.go('/register');
        }
    });
}
