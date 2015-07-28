/*
    Sign-up/Register Module Client JS

    Client JS Files mainly contain the:
    1) Helpers
    2) Events
*/

//==========    registerLayout template START    ==========

Template.registerLayout.helpers({
    usernameCharCount: function() {
        if (!Session.get('registerUsernameCharCount')) {
            return 0;
        } else {
            return Session.get('registerUsernameCharCount');
        }
    },
    submitState: function() {
        if (Session.get('registerUsernameValid') && Session.get('registerPasswordValid')) {
            return {
                state: '',
                color: 'primary'
            };
        } else {
            return {
                state: 'disabled',
                color: 'default'
            };
        }
    }
});

Template.registerLayout.events({
    'click #registerSubmit, submit': function(evt, template) {
        evt.preventDefault();
        //send submission
        var username = template.find('#registerUsername').value;
        var password = template.find('#registerPassword').value;

        Accounts.createUser({
            username: username,
            password: password
        }, function(err) {
            if (err) {
                alert(err);
                if (err.error === 'bad_user') {
                    template.find('#registerUsername').value = "";
                    Session.set('registerUsernameCharCount', 0)
                }
            }else {
                Router.go('/home');
            }
        });

    },
    'keyup #registerUsername': function(evt, template) {
        // enforce length restriction
        if (evt.currentTarget.value.length > 20) {
            evt.currentTarget.value = evt.currentTarget.value.substr(0, 20);
        }
        //check states of field

        if (USERNAME_REGEX.test(evt.currentTarget.value)) {
            //set valid state of element
            template.$('#registerUsernameFormGroup').removeClass('has-error');
            Session.set('registerUsernameValid', true);
        } else {
            template.$('#registerUsernameFormGroup').addClass('has-error');
            Session.set('registerUsernameValid', false);
        }
        Session.set('registerUsernameCharCount', evt.currentTarget.value.length);
    },
    'keyup #registerPassword2, keyup #registerPassword': function(evt, template) {
        var passwordField = template.find('#registerPassword').value;
        var passwordField2 = template.find('#registerPassword2').value;

        if (passwordField === passwordField2 || passwordField2.length === 0) {
            template.$('#registerPassword2FormGroup').removeClass('has-warning');
            template.$('#registerPassword2Help').addClass('invisible');
            if (passwordField.length > 0 && passwordField2.length > 0) {
                Session.set('registerPasswordValid', true);
            } else {
                Session.set('registerPasswordValid', false);
            }
        } else {
            template.$('#registerPassword2FormGroup').addClass('has-warning');
            template.$('#registerPassword2Help').removeClass('invisible');
            Session.set('registerPasswordValid', false);
        }
    }
});

//==========    registerLayout template END    ==========
