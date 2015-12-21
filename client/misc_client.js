Template.loginPanel.events({
    'click #loginToRegister': function(evt, template) {
        evt.preventDefault();
        Router.go('/register');
    },
    'submit': function(evt, template) {
        evt.preventDefault();
        //Get Info
        var user = template.find('#loginUser').value;
        var pass = template.find('#loginPass').value;
        Meteor.loginWithPassword(user, pass, function(err) {
            if (!err) {
                //proceed to home
                Router.go('/home');
            } else {
                alert(err);
                $('#loginUser')[0].value = '';
                $('#loginPass')[0].value = '';
            }
        });
    }
});

Template.header.events({
    'click #headerLogOut': function(evt, template) {
        evt.preventDefault();
        Meteor.logout();
        Router.go('/');
    },
    'click .headerLinkToPage':function(evt, template){
        evt.preventDefault();
        var route = evt.currentTarget.getAttribute('id');
        Router.go('/'+route);
    }
});
