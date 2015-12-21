//========== Mongo Collections ========== START

ThreeWord = new Mongo.Collection('ThreeWord');

//========== Mongo Collections ========== END

//========== Methods ========== START

Meteor.methods({
    createStory: function(title, plotGuide) {
        title = title.trim();
        plotGuide = plotGuide.trim();
        //===== validation checks ===== start
        if (!Meteor.user())
            throw threeWord_error_001;
        if (!Match.test(title, String) || !Match.test(plotGuide, String))
            throw threeWord_error_002;
        if (title.length > 40)
            throw threeWord_error_006;
        if (title.length < 1)
            throw threeWord_error_007;
        //===== validation checks ===== end

        if (plotGuide.length < 1)
            plotGuide = 'Free & Easy';

        var result = new ThreeWordStory(title, plotGuide, this.userId);

        return ThreeWord.insert(result);
    },
    editStory: function(storyId, fields) {
        //To Be Considered
    },
    deleteStory: function(storyId) {
        //===== validation checks ===== start
        if (!Meteor.user())
            throw threeWord_error_001;
        if (!ThreeWord.findOne(storyId))
            throw threeWord_error_003;
        if (ThreeWord.findOne(storyId).owner != this.userId)
            throw threeWord_error_004;
        //===== validation checks ===== end
        return ThreeWord.remove(storyId);
    },
    addStorySegment: function(storyId, segmentContent, isNewPara) {
        segmentContent = segmentContent.trim();
        //===== validation checks ===== start
        if (!Meteor.user())
            throw threeWord_error_001;
        if (!ThreeWord.findOne(storyId))
            throw threeWord_error_003;
        if (ThreeWord.findOne(storyId).story.length === 0 && ThreeWord.findOne(storyId).owner != this.userId)
            throw threeWord_error_004;
        if (!Match.test(segmentContent, String))
            throw threeWord_error_002;
        if (segmentContent.length === 0)
            throw threeWord_error_005;

        //===== validation checks ===== end

        //tokenize string by spaces and only accept 3 tokens
        var finalString = threeWord_tokenizeString(segmentContent);

        var result = new ThreeWordStorySegment(finalString, this.userId, ThreeWord.findOne(storyId).story.length + 1, isNewPara);

        return ThreeWord.update(storyId, {
            $push: {
                story: result
            },
            $set: {
                dateModified: new Date()
            }
        });

    },
    updateStorySegment: function(storyId, segmentContent) {},
    deleteStorySegment: function(storyId) {
        //=====validation checks ===== start
        if (!Meteor.user())
            throw threeWord_error_001;
        if (!ThreeWord.findOne(storyId))
            throw threeWord_error_003;
        if ((ThreeWord.findOne(storyId).owner != this.userId) &&
            (ThreeWord.findOne(storyId).story.pop().author != this.userId))
            throw threeWord_error_004;
        //=====validation checks ===== end

        return ThreeWord.update(storyId, {
            $pop: {
                story: 1
            }
        });

    }
});

threeWord_makeHTMLText = function(stringText) {
    var result = stringText.replace(/(?:\r\n|\r|\n)/g, '<br>');
    return result;
}

threeWord_makeSafeString = function(stringText) {
    return String(stringText).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

threeWord_tokenizeString = function(stringText) {
    var result;
    var tokenArray = stringText.split(' ');

    var limit = tokenArray.length > 3 ? 3 : tokenArray.length;
    result = tokenArray[0];

    for (var i = 1; i < limit; i++) {
        result = result + ' ' + tokenArray[i];
    }
    result = result + ' ';
    return result;
}

//========== Methods ========== END

//========== Prototypes ========== START

ThreeWordStory = function(title, plotGuide, owner) {
    this.title = title;
    this.plotGuide = plotGuide;
    this.dateCreated = new Date();
    this.dateModified = this.dateCreated;
    this.story = [];
    this.owner = owner;
};

ThreeWordStorySegment = function(content, author, index, newPara) {
    this.index = index;
    this.author = author;
    this.dateCreated = new Date();
    this.dateModified = this.dateCreated;
    this.content = content;
    this.newPara = newPara;
};

//========== Prototypes ========== END

//========== Meteor Errors ========== START
threeWord_error_001 = new Meteor.Error('001 - not logged in', 'You are not logged in. Register or login to continue.');
threeWord_error_002 = new Meteor.Error('002 - type mismatch', 'Expected Strings. Unknown formats found.');
threeWord_error_003 = new Meteor.Error('003 - no such story', 'The story could not be found.');
threeWord_error_004 = new Meteor.Error('004 - not owner', 'You do not own this story. Only the owner can perform this action.');
threeWord_error_005 = new Meteor.Error('005 - empty input', 'Expected something. Got nothing');
threeWord_error_006 = new Meteor.Error('006 - input too long', 'That\'s what she said!');
threeWord_error_007 = new Meteor.Error('007 - input too short', 'Missing information.');
//========== Meteor Errors ========== END
