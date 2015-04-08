function UserInterface()
{
	this.unit = null;

	this.clearWord = function()	{
		References.word.text(1);
	};

	this.incrementWord = function()	{
		References.word.text(parseInt(References.word.text()) + 1); 
	};

	this.clearScore = function() {
		References.score.text(0);
	};

	this.setScore = function(wordScore) {
		References.score.text(wordScore);
	};

	this.changeCurrentWord = function(newWord) {
		References.currentWord.text(newWord);
	};

	this.changePrepositionTense = function(tense) {
		vTense = '';

		switch(tense) {
			case Step.PrepositionAnwser:
				vTense = 'PrepositionAnwser:';
				break;
		}

		References.prepositionTense.text(vTense);
	};

	this.clearUserInput = function() {
		References.userInput.val('');
	};

	this.getUserInput = function() {
		return References.userInput.val().toLowerCase();
	};

	this.setUserInput = function(newValue) {
		References.userInput.val(newValue);
	};

	this.userInputIsNotEmpty = function() {
		if(this.getUserInput().length === 0)
			return false;

		return true;
	};

	this.addPrepositionInPrepositionList = function(preposition, wordScore, wordHistory, mode) {
		titleAnswer = '';
		
		classAnswer = '';
		if(wordScore[0] == 1) {
			classAnswer = ' class="correct"';
		} else {
			classAnswer = ' class="wrong"';
			titleAnswer = ' title="You typed: '+wordHistory[0]+'"';
		}


		newTag = '<ul><li>'+preposition.sentence+'</li><li'+classAnswer+titleAnswer+'>'+preposition.anwser+'</li></ul>';
		References.wordHistoryList.prepend(newTag);
	};

	this.resetWordCounter = function(vectorSize) {
		References.word.text(0);
		References.totalWords.text(vectorSize);
	};

	this.resetScore = function(vectorSize) {
		References.score.text(0);
	};

	this.resetWordHistory = function() {
		References.wordHistoryList.html('');
	};

	this.showDinamic = function() {
		References.dinamic.slideDown(1000);
	};

	this.hideDinamic = function() {
		References.dinamic.slideUp(1000);
	};

	this.showResults = function() {
		References.results.slideDown(1000);
	};

	this.hideResults = function() {
		References.results.slideUp(1000);
	};

	this.enableRetryMissed = function() {
		References.retryMissed.removeClass('disableRetryMissed');
		References.retryMissed.removeAttr('href');
	};

	this.disableRetryMissed = function() {
		References.retryMissed.addClass('disableRetryMissed');
		References.retryMissed.attr('href','#');
	};

	this.showSubMenu = function() {
		References.subMenu.slideDown(200);
	};

	this.showAbout = function() {
		References.subMenuBooks.hide();
		References.subMenuAbout.show(200);
		References.subMenu.slideDown(300);
	};

	this.showBook = function() {
		References.subMenuAbout.hide();
		References.subMenuBooks.show(200);
		References.subMenu.slideDown(300);
	};

	this.hideSubMenu = function() {
		References.subMenu.slideUp(200);
	};

	this.quickHideSubMenu = function() {
		References.subMenu.slideUp(100);
	};

	this.showUnit = function(content, x, y) {
		if(this.unit === null)
			this.unit = this.buildUnit(content);

		this.showInformation(this.unit,x,y);
	};

	this.showCheat = function()	{
		References.cheat.show();
	};

	this.hideCheat = function()	{
		References.cheat.hide();
	};

	this.showInformation = function(content, x, y) {
		References.information.css('left',(x+10));
		References.information.css('top',(y+10));
		References.informationText.html(content);
		References.information.fadeIn(200);		
	};

	this.hideInformation = function() {
		References.information.fadeOut(200);
	};

	this.buildUnit = function(unitList) {
		var ulTag = '<ul>';
		
		ulTag += '<li>'+unitList+'</li>';

		ulTag += '</ul>';

		return ulTag;
	};

	this.resetUnit = function() {
		this.unit = null;
	};

	this.changeBookInMenu = function(book) {
		References.bookIcon.removeClass('r1 r2');
		
		switch(book) {
			case Books.Red:
				References.bookIcon.addClass('r1');
				break;
			case Books.Blue:
				References.bookIcon.addClass('r2');
				break;
		}
	};

	this.switchLearning = function() {
		this.learningSelection('enable');
		this.practicingSelection('disable');
	};

	this.switchPracticing = function() {
		this.learningSelection('disable');
		this.practicingSelection('enable');
	};

	this.learningSelection = function(selection) {
		if(selection === 'enable') {
			References.switchLearning.addClass('mode-selected');
			References.switchLearning.removeClass('mode-unselected');
		}
		else {
			References.switchLearning.removeClass('mode-selected');
			References.switchLearning.addClass('mode-unselected');
		}
	};

	this.practicingSelection = function(selection) {
		if(selection === 'enable') {
			References.switchPracticing.addClass('mode-selected');
			References.switchPracticing.removeClass('mode-unselected');
		}
		else {
			References.switchPracticing.removeClass('mode-selected');
			References.switchPracticing.addClass('mode-unselected');
		}
	};

	this.showLearningPreposition = function() {
		References.learningPreposition.show();
		this.makeButtonsSmall();
	};

	this.hideLearningPreposition = function() {
		References.learningPreposition.hide();
		this.makeButtonsBig();
	};

	this.setLearningPreposition = function(word) {
		References.learningPreposition.text(word);
	};

	this.makeButtonsSmall = function() {
		References.unit.addClass('relativeUnit');
		References.replay.addClass('smallPlay');
	};

	this.makeButtonsBig = function() {
		References.unit.removeClass('relativeUnit');
		References.replay.removeClass('smallPlay');
	};

	this.openList = function(book) {
		var referenceList = [References.listBook1,References.listBook2];
		var toRemove = null;
		switch(book) {
			case 1:
				this.opencloseList(References.listBook1);
				toRemove = References.listBook1;
				break;
			case 2:
				this.opencloseList(References.listBook2);
				toRemove = References.listBook2;
				break;
		}

		if(toRemove)
			removeItem(toRemove,referenceList);

		this.closeMass(referenceList);
	};

	this.closeMass = function(referenceList) {
		for(var i =0; i<6; i++)
			referenceList[i].hide();
	};

	this.opencloseList = function(reference) {
		if(reference.is(':visible'))
			reference.fadeOut(200);
		else
			reference.fadeIn(200);
	};
}

//This prototype function allows you to remove even array from array
removeItem = function(x, list) { 
    var i;
    for(i in list){
        if(list[i] === x)
            list.splice(i,1);
    }
};