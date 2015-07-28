/*
	Sign-up/Register Module Server JS

	Client JS Files mainly contain the:
	1) Methods
*/

Accounts.onCreateUser(function(options, user) {
    //Define the user 'profile' field with default values
    user.profile = {};

    //Define the user 'COD' field with COD-specific fields
    user.cod = {};

    //Check for invalid fields

    var userCaseRegex = new RegExp(['^', user.username, '$'].join(''), 'i'); //Regex for case-insensitive search for username

    if (!USERNAME_REGEX.test(user.username) ||
        user.username.length > 20) {
        throw register_error_001;
    } else if (Meteor.users.findOne({
            username: userCaseRegex
        })) {
        throw register_error_002;
    }
    return user;
});
