
function Preposition(sentence,anwser,book,unit, prhase)
{
	this.sentence = sentence;
	this.anwser = anwser;
	this.book = book;
	this.unit = unit;
	this.prhase = prhase;
}

function Book(min, max)
{
	this.bookVector = new Array();

	//max+1 because slice doesn't get the last index
	this.bookVector = verbBucket;
}