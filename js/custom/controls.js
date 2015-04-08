function Controls() {
	this.word = null;
	this.score = 0;
	this.wordScore = [0];
	this.wordCounter = 1;
	this.currentWordCounter = 0;
	this.wordHistory = [null,null,null];
	this.currentVector = null;
	this.currentBook = null;
	this.wrongAnswers = null;
	this.currentTab = Tabs.None;
	this.currentMode = Mode.Learning;

	this.startControls = function() {
		this.defineAutoFocus();
		this.defineOnEnter();
		this.defineOnClick();
		this.defineOnOver();
		this.createBooksVectors();
		this.setInitialValues();
	};
	
	this.defineAutoFocus = function() {
		References.userInput.focus();

		References.userInput.on('blur',function() {
			References.userInput.focus();
		});
	};

	this.defineOnEnter = function() {
		References.userInput.keydown(function(e) {
			if(e.which == 9)
				e.preventDefault();
			else if(e.which == 13)
				controls.userEnter();
			else if(e.which == 32) {
				e.preventDefault();
				//controls.playVoice();
			}
			else if(e.which == 17 || e.which == 18) {
				e.preventDefault();
				userInterface.showUnit(controls.word.unit, References.unit.position().left, References.unit.position().top);
			}
		});

		References.userInput.keyup(function(e) {
			if(e.which == 17 || e.which == 18) {
				e.preventDefault();
				userInterface.hideInformation();
			}

		});
	};

	this.defineOnClick = function() {
		References.bookButton.click(function(e) {
			buttonID = e.target.id || e.target.parentNode.id;

			switch(buttonID) {
				case 'r1':
					controls.chooseBook(controls.book1);
					userInterface.changeBookInMenu(Books.Red);
					break;
				case 'r2':
					controls.chooseBook(controls.book2);
					userInterface.changeBookInMenu(Books.Blue);
					break;
			}

			controls.currentTab = Tabs.None;
			userInterface.hideSubMenu();

			controls.resetValues();
		});

		References.retry.click(function() {
			controls.chooseBook(controls.currentBook);
			controls.resetValues();
		});

		References.retryMissed.click(function() {
			controls.getVectorFromWrongAnswers();
		});

		References.bookButton.click(function() {
			if($(this).hasClass("active"))
				return;
		    References.bookButton.removeClass('active');
		    $(this).addClass('active');
		});

		References.cheat.click(function() {
			userInterface.setUserInput(controls.word.infinitive);
		});

		References.replay.click(function() {
			//controls.playVoice();
		});

		References.book.click(function() {
			if(controls.currentTab == Tabs.Book) {
				userInterface.hideSubMenu();
				controls.currentTab = Tabs.None;
			}
			else {
				if(References.subMenu.is(":visible"))
					userInterface.quickHideSubMenu();

				userInterface.showBook();

				controls.currentTab = Tabs.Book;
			}
			
		});

		References.about.click(function() {
			if(controls.currentTab == Tabs.About) {
				userInterface.hideSubMenu();
				controls.currentTab = Tabs.None;
			}
			else {
				if(References.subMenu.is(":visible"))
					userInterface.quickHideSubMenu();

				userInterface.showAbout();

				controls.currentTab = Tabs.About;
			}
			
		});

		References.prepositionList.click(function() {
			References.blackLayer.show();
			References.prepositionListLayer.show();
			References.dinamic.hide();			
		});

		References.closePrepositionListButton.click(function() {
			References.blackLayer.hide();
			References.prepositionListLayer.hide();
			References.dinamic.show();
		});

		References.switchLearning.click(function() {
			controls.switchLearning();
		});

		References.switchPracticing.click(function() {
			controls.switchPracticing();
		});

		References.listBook1Trigger.click(function() {
			controls.openList(1);
		});
		References.listBook2Trigger.click(function() {
			controls.openList(2);
		});
	};

	this.defineOnOver = function() {
		References.unit.on("mouseenter",function(e) {
			userInterface.showUnit(controls.word.unit, e.pageX, e.pageY);
		});

		References.unit.on("mouseleave",function(e) {
			userInterface.hideInformation();
		});
	};

	this.createBooksVectors = function() {	
		this.book1 = new Book("Red");
		this.book2 = new Book("Blue");
		
		this.fillPrepositionList();
	};

	this.userEnter = function() {
		if(!this.bookFinished) {
			if(userInterface.userInputIsNotEmpty()) {
        this.currentStep = Step.PrepositionAnwser;
				this.verifyWord();

				userInterface.changePrepositionTense(this.currentStep);

				this.setScore();
				userInterface.addPrepositionInPrepositionList(this.word,this.wordScore,this.wordHistory,this.currentMode);
				this.addWrongAnswer();
				this.updateStatus();

				if(this.currentMode === Mode.Practicing)
					userInterface.showCheat();
				

				userInterface.clearUserInput();
				this.currentStep = "";
			}
		}	
	};

	this.setInitialValues = function() {
		this.chooseBook(this.book1);
		this.wrongAnswers = [];
		this.currentTab = Tabs.Book;
		userInterface.makeButtonsSmall();
		this.resetValues();
	};

	this.resetValues = function() {
		this.cleanWrongAnswers();
		
		if(this.currentMode == Mode.Learning) {
			this.currentStep = Step.PrepositionAnwser;
			userInterface.changePrepositionTense(Step.PrepositionAnwser);
			userInterface.hideCheat();
		} else {
			this.currentStep = Step.PrepositionAnwser;
			userInterface.changePrepositionTense(Step.PrepositionAnwser);
			userInterface.showCheat();
		}

		userInterface.resetWordCounter(this.currentVector.length);
		userInterface.resetScore(this.currentVector.length);
		this.wordCounter = 1;
		this.score = 0;
		this.currentWordCounter = 0;
		this.totalWords = this.currentVector.length;
		this.bookFinished = false;

		userInterface.resetWordHistory();
		this.updateStatus();
		this.resetDisplay();
	};

	this.switchLearning = function() {
		if(controls.currentMode == Mode.Learning)
			return;

		userInterface.switchLearning();
		controls.currentMode = Mode.Learning;

		controls.chooseBook(controls.currentBook);
		userInterface.showLearningPreposition();
		controls.resetValues();
	};

	this.switchPracticing = function() {
		if(controls.currentMode == Mode.Practicing)
			return;

		userInterface.switchPracticing();
		controls.currentMode = Mode.Practicing;
		controls.chooseBook(controls.currentBook);
		userInterface.hideLearningPreposition();
		controls.resetValues();
	};

	this.cleanWrongAnswers = function() {
		while(this.wrongAnswers.length > 0) 
			this.wrongAnswers.pop();
	};

	this.addWrongAnswer = function() {
		if(this.wordScore[0] === 0)
			this.wrongAnswers.push(this.word);
	};


	this.chooseBook = function(book) {
		this.currentBook = book;
		this.currentVector = book.bookVector.slice(0);
	};

	this.setScore = function() {
		newScore = 0;
		this.score += this.wordScore[0];
		newScore = (100*this.score)/this.currentWordCounter;
		
		userInterface.setScore(newScore.toFixed(2));
	};

	this.updateStatus = function() {
		if(this.currentVector.length !== 0)
			this.getNextWord();
		else
			this.bookFinished = true;
		
		if (this.bookFinished) {
			this.showResults();
		}else{
			this.updateUI();
			this.cleanWordScore();
		}
	};

	this.getNextWord = function() {	
		randomIndex = Math.floor((Math.random() * this.currentVector.length) + 0);
		this.word = this.currentVector[randomIndex];
		this.currentVector.splice(randomIndex,1);
		userInterface.setLearningPreposition(this.word.sentence);
	};

	this.updateUI = function() {
		//this.playVoice();
		userInterface.resetUnit();
		userInterface.incrementWord();
		this.currentWordCounter+=1;
	};

	this.cleanWordScore = function() {
		this.wordScore[0] = 0;
	};

	this.verifyWord = function() {
		userInput = userInterface.getUserInput().trim();
		switch(this.currentStep) {
			case Step.PrepositionAnwser:
				this.verifyAnwser(userInput);
				break;
		}
	};

	this.verifyAnwser = function(userInput) {
		this.wordHistory[0] = userInput;
		if(this.word.anwser.toLowerCase() == userInput.toLowerCase())
			this.wordScore[0] = 1;
	};


	this.showResults = function() {
		this.detachOnclickRetryMissed();
		if(this.wrongAnswers.length > 0)
			this.enableRetryMissed();
		else
			this.disableRetryMissed();

		userInterface.showResults();
		userInterface.hideDinamic();
	};

	this.enableRetryMissed = function() {
		References.retryMissed.click(function() {
			controls.getVectorFromWrongAnswers();
		});

		userInterface.enableRetryMissed();
	};

	this.disableRetryMissed = function() {
		this.detachOnclickRetryMissed();
		userInterface.disableRetryMissed();	
	};

	this.detachOnclickRetryMissed = function() {
		References.retryMissed.unbind('click');
	};

	this.getVectorFromWrongAnswers = function() {
		this.currentVector = this.wrongAnswers.slice(0);
		this.resetValues();
	};

	this.resetDisplay = function() {
		userInterface.showDinamic();
		userInterface.hideResults();
	};

	/*this.playVoice = function(word) {
		this.word.voice.load();
		this.word.voice.play();
	};*/

	//BEWARE, HERE BE DRAGONS
	//made this in a hurry
	//it is not assembly as is looks

	this.createHtmlList = function(v) {

		var conc = '<div class="heading"><div class="number">#</div><div>Sentence</div><div>Answer</div><div>Unit</div></div>';
		for(var i = 0 ; i < v.length; i++) {
			count = i+1;
			conc += '<div class="prepositionitem"><div>'+count+'</div><div>'+v[i].sentence+'</div><div>'+v[i].anwser+'</div><div>'+v[i].unit+'</div></div>';
		}
		return conc;
	};

	this.fillPrepositionList = function () {

		var book1,book2;

		book1 = this.createHtmlList(this.book1.bookVector);
		book2 = this.createHtmlList(this.book2.bookVector);
		
		References.listBook1.html(book1);
		References.listBook2.html(book2);
	};

	this.openList = function(book) {
		userInterface.openList(book);
	};
}


function Preposition(sentence,anwser,book,unit) {
	this.sentence = sentence;
	this.anwser = anwser;
	this.book = book;
	this.unit = unit;
	//this.voice = new Audio("voices/"+infinitive+".mp3");
}

function Book(color){
	this.prepositionVector = [];

	if(color == "Red"){
	 this.bookVector = prepositionBucketRed; 
	}else{
		this.bookVector = prepositionBucketBlue;
	}
}


function loadPrepositions(prepositionBucket) {
	$.ajax({
	    type: "GET",
	    url: "prepositions.xml",
	    dataType: "xml",
	    success: function(xml) {
	        $(xml).find('Preposition').each(function() {
		        var sentence = $(this).find('Sentence').text();
		        var anwser = $(this).find('Answer').text();
		        var book = $(this).find('Book').text();
		        var unit = $(this).find('Unit').text();
		        
		        var newPreposition = new Preposition(sentence,anwser,book,unit);
		        if(book == "Red"){
		        	prepositionBucketRed.push(newPreposition);
		        }else{
		        	prepositionBucketBlue.push(newPreposition);
		        }
		        prepositionBucket.push(newPreposition);
	    	});

	    	afterLoad();
	    },
	    error: function() {
	    	alert("An error occurred while processing XML file.");
	    }
	});
}