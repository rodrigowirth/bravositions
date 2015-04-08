var Step = {
	PrepositionAnwser: 0
};

var Books = {
	Red: "Red",
	Blue: "Blue"
};

var Tabs = {
	None: 0,
	About: 1,
	Book: 2,
	PrepositionList: 3
}

var Mode = {
	Learning: 0,
	Practicing: 1
}

$(function(){
	prepositionBucket = new Array();
	prepositionBucketRed = new Array();
	prepositionBucketBlue = new Array();
	loadPrepositions(prepositionBucket);
});

References = null;
webpageInterface = null;
prepositionsControls = null;

function afterLoad()
{
	References = new ElementsReferences();
	userInterface = new UserInterface();
	controls = new Controls();
	controls.startControls();
}
