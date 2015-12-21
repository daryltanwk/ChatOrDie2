//===== Publications ===== START
Meteor.publish('allStories', function () {
	return ThreeWord.find({});
});
//===== Publications ===== END
