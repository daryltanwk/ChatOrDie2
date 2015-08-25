//========== Sign Up/Register Module Errors ========== START

register_error_001 = new Meteor.Error('bad_user', 'Bad username.', 'The username provided did not meet the requirements specified.');
register_error_002 = new Meteor.Error('bad_user', 'User already exists.', 'The username is already in use.');

//========== Sign Up/Register Module Errors ========== END

//========== MISC Errors ========== START

misc_error_001 = new Meteor.Error('bad_recipeint', 'Unknown recipient', 'The message could not be sent because the recipient is unknown.');
misc_error_002 = new Meteor.Error('bad_content', 'Invalid message', 'The message was not a String.');
misc_error_003 = new Meteor.Error('bad_login', 'Not logged in', 'Please log in to send messages.');

//========== MISC Errors ========== END