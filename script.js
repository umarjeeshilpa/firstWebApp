// Keep track of deployed changes, increment
console.log("Version 0.001")

// collapsible event listener
var coll = document.getElementsByClassName("collapsible");
var i;
for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", collapsible);
}

// global buttons and elements

// Button to save a test, once saved it appears in dropdown for tests
// under Practice Dictation using tests
const saveButton = document.querySelector('#save')
const saveEl = document.getElementById('save')

//Element to display error message for save option
const errMsg1 = document.getElementById('errormsg1')

// text area to add words for test
const textEl = document.getElementById('text')

// Button to clear all cached tests
const clearButton = document.querySelector('#clearHistory')
const clearEl = document.getElementById('clearHistory')
clearEl.disabled = true

// Button to clear selected cached test
const clearItemButton = document.querySelector('#clearItem')
const clearItemEl = document.getElementById('clearItem')
clearItemEl.disabled = true

// Dropdown of tests to be selected from cached or saved tests
const dropdown = document.getElementById('arrayDropdown');

// Button to dictate the selected test, enabled on selecting a test
const dictateButton = document.querySelector('#dictate')
const dictateButtonEl = document.getElementById('dictate')
dictateButtonEl.disabled = true

// Button to check the words, on each click displays spellings of the words in same order
// as given during dictate for this test
const checkButton = document.querySelector('#check')
const checkButtonEl = document.getElementById('check')
checkButtonEl.disabled = true

// Button to evaluate as per marked check box to decide whether to give another practice test
// for incorrect words or done with practice tests
const evalButton = document.querySelector('#evaluate')
const evalEl = document.getElementById('evaluate')
evalEl.disabled = true


// Headings about practice test number
const headEl = document.getElementById('headings')
// element list used to list the words during dictation and words with checkbox during check and evaluate
const ulEl = document.getElementById('listItems')

// Initializations
// Keep counter for words
let count = 0
// keep count for practice test
let practiceTest = 1
// Length of words to dictate during test
let wordsToDictateLength = 0
// Indicator about whether dictation test started
let start = false

// array of cached tests
let testNameList = []

// Array of words of a test
let words = []

// Initialization for text to speech
const utterance = new SpeechSynthesisUtterance()
const voices = speechSynthesis.getVoices()
console.log(voices)
let voiceIndex = -1
// Use en-IN voice if available, else default
for (let j = 0; j < voices.length; j++) {
	if ( voices[j].lang == "en-IN") {
		voiceIndex = j
		break;
	}
}
if (voiceIndex > -1) {
	utterance.voice = voices[voiceIndex]
}

// Initial Dropdown creation as per cached entries
createDropDown()

// enable clear all tests button if exists some tests
if (testNameList.length > 0) {
	clearEl.disabled = false
}

// Function called on click for collapsible
function collapsible() {
   this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.maxHeight){
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = "initial";
    } 
}

// Function to fetch from localstorage tests
// and last test length, not used corrently
// It has --Please choose an option-- as first option
function createDropDown() {
	var options="";
	testNameList = []
	testNameList.push("--Please choose an option--")
	for (let i = 0; i < localStorage.length; i++) {
		if (localStorage.key(i) != "length") {
			testNameList.push(localStorage.key(i))			
		}
	}
	testNameList.sort()
	console.log(testNameList)
	testNameList.map((op,i)=>{
         options+=`<option value="${op}" id="${i}" style="border-radius: 5px;"">${op}</option>`
    })
    document.getElementById("arrayDropdown").innerHTML=options;
}

// Function called on change in dropdown selection
// it initializes dictation and enables dictate button
function selectOption() {
	// get the index of the selected option
    let selectedIndex = dropdown.selectedIndex;
    // get a selected option and text value using the text property
    let selectedValue = dropdown.options[selectedIndex].text;
	console.log(selectedValue)
	let localWords = localStorage.getItem(selectedValue)
	if (localWords == null) {
		words = []
		wordsToDictateLength = 0
		dictateButtonEl.disabled = true
		return
	}
	console.log(localWords)
	words = localWords.split(',')	
	wordsToDictateLength = words.length
	shuffle(words)
	
	dictateButtonEl.disabled = false
	clearItemEl.disabled = false
	
	count = 0
	start = false
	practiceTest = 1
	ulEl.innerHTML = ''
	headEl.innerText = ''
}

// Function used to shuffle words array so that given words are randomized
// while giving dictation
// Uses global wordsToDictateLength
function shuffle(words) {
	
	let length = wordsToDictateLength - 1
	while (length > 0) {
		let index = Math.floor(Math.random() * (length + 1))
		if (index != length) {
			temp = words[index]
			words[index] = words[length]
			words[length] = temp
		}
		length--
	}
}

// Function used to same the dictation test by given name
// and set of words
// recreates the dropdown
function saveText() {
	let textInput = textEl.value
	if (textInput == '') {
		errMsg1.innerText="Please enter dictation words"
		return
	}
	// text input for test name	
	const dictationKey = document.getElementById('keyword')
	console.log(dictationKey.value)
	
	// Validation for test name
	let regex = /^[a-z0-9]+$/i
	if (regex.test(dictationKey.value)) {
		console.log("PASS")
	} else {
		errMsg1.innerText="Please enter dictation name using only alpha numeric characters"		
		return		
	}
	
	textInput = textInput.trim()
	textInput = textInput.replaceAll(' ', '\n')
	words = textInput.split( "\n" )		
	console.log(words)
	console.log(words.length)

	localStorage.setItem(dictationKey.value, words)
	localStorage.setItem("length", wordsToDictateLength)
	
	dictationKey.value = ""
	errMsg1.innerText=""
	textEl.value = ""	
	createDropDown()	
}

//dictation related internal function which dictates next word as per 
// count
// dictate each word three times with delay
// disables dictation button once done dictating all words
// Disables save, check and evaluate at start of dictation
// Enables Check at end of dictation
// Keep track of PracticeTest count
function dictateNextInternal(wordsTodictate) {
	
	if (dictateButtonEl.disabled) {
		console.log("Disabled")
		return
	}
	dictateButtonEl.disabled = true	
	if (wordsToDictateLength == 1 && wordsTodictate[0] == "") {
		console.log("write words in text box and press save")
		utterance.text = "Write words in text box and press save. Then press dictate"
		speechSynthesis.speak(utterance)
		saveEl.disabled = false	
		return
	}
	if (wordsToDictateLength == count) {
		console.log("disable start dictation")
		utterance.text = "Done with dictation. Press Check Dictation to check"
		speechSynthesis.speak(utterance)
		checkButtonEl.disabled = false
		practiceTest++
		return
	}
	if (count == 0) {
		headEl.innerText = "Practice Dictation:" + practiceTest
		dropdown.disabled = true
		clearEl.disabled = true
		clearItemEl.disabled = true
		saveEl.disabled = true		
	}
	
	let word = wordsTodictate[count]
	count++
    
    //create
    const li = document.createElement('li')
    li.setAttribute('data-counter',count)
    
    li.innerHTML = '<b> Word </b>' + count
	utterance.text = word
	//append
    ulEl.appendChild(li)
    speechSynthesis.speak(utterance)
    //TODO timer based can be done event based
    setTimeout(() => {  speechSynthesis.speak(utterance); }, 5000);
    setTimeout(() => {  speechSynthesis.speak(utterance); }, 10000);	
    setTimeout(() => { dictateButtonEl.disabled = false;dictateNextInternal(wordsTodictate);}, 10100); 
}

// Function called on click of dictate, dictates list of words as per wordsTodictate
function dictateNext() {
	dictateNextInternal(words)
}

// Function called on click on Check, displays spellings for dictated words in the order
// With a check box which then can be used to mark correct or incorrect words
// enabled evaluate when done with all words of dictation shown in check
function checkNext() {
	checkButtonEl.disabled = true
	console.log(start)
	if (start && (count == wordsToDictateLength)) {
		console.log("Done check Dictation")
		utterance.text = "Done with check dictation. Mark correct words and then press Evaluate"
		speechSynthesis.speak(utterance)
		checkButtonEl.disabled = true
		evalEl.disabled = false
		return
	}else if (!start && (wordsToDictateLength == count)) {
		count = 0
		start = true
	} 
		
	let word = words[count]
	count++
    
    //create
	const li = ulEl.querySelector('[data-counter="'+count+'"]')
	li.innerHTML = '<label><input id="checkbox'+ count + '" type="checkbox">Word ' + count + ' <b>' + word + '</b></label>'
	utterance.text = word
    speechSynthesis.speak(utterance)
	setTimeout(() => {checkButtonEl.disabled = false;}, 2000);		
}

//Function called on click of evaluate
// Evaluates as per marked words and then enables dictate if there are incorrect words
// if all words correct one can change the test and start new dictation
function evaluate() {
	let length = wordsToDictateLength
	let incorrect = 0
	let i = 1
	evalEl.disabled = true
	for (i = 1; i <= length; i++) {
		let id = "checkbox" + i
		const checkBox = document.getElementById(id)
		checkBox.disabled = true
		if (!checkBox.checked) {						
			incorrect++
		}		
	}
	
	utterance.text = "You got " + (length - incorrect) + "out of " + length
	speechSynthesis.speak(utterance)
	
	if (incorrect == 0) {
		utterance.text = "Congratulations, no more practice test"
		speechSynthesis.speak(utterance)
		dropdown.disabled = false
		clearEl.disabled = false
		clearItemEl.disabled = false
		saveEl.disabled = false
		count = 0
		start = false
		console.log("enabled dropdown")
		return
	}
	
	// adjust Array
	wordsToDictateLength = incorrect
	let indexCorrect = incorrect + 1
	i = 1
	
	while (incorrect && indexCorrect <= wordsToDictateLength) {
		let id = "checkbox" + i
	
		const checkBox = document.getElementById(id)
		
		if (!checkBox.checked) {
			incorrect--
		} else {
			if (i  < indexCorrect) {
				let id1 = "checkbox" + indexCorrect
				let checkBox1 = document.getElementById(id1)
				console.log(indexCorrect)
				while (checkBox1.checked) {					
					indexCorrect++
					id1 = "checkbox" + indexCorrect
					checkBox1 = document.getElementById(id1)
					console.log(indexCorrect)
				}
				let temp = words[i - 1]
				words[i - 1] = words[indexCorrect -1]
				words[indexCorrect -1] = temp
				indexCorrect++
			}
		}		
		i++
	}
	for (i = 1; i <= length; i++) {
		const li = ulEl.querySelector('[data-counter="'+i+'"]')		
		li.remove()
	}
	shuffle(words)
	count = 0
	start = false
	dictateButtonEl.disabled = false		
}

// function called on click of clearAll button
// Clear all localstorage or cached information
function clearHistory() {
	dictateButtonEl.disabled = true
	localStorage.clear()
	textEl.value = ''
	clearEl.disabled = true
	createDropDown()
}

// function called on click of clearSelected button
// Clear selected cached item
function clearItem() {
	dictateButtonEl.disabled = true
	// get the index of the selected option
    let selectedIndex = dropdown.selectedIndex;
    // get a selected option and text value using the text property
    let selectedValue = dropdown.options[selectedIndex].text;
	localStorage.removeItem(selectedValue)
	createDropDown()	
}

// Registering event listeners
clearButton.addEventListener('click', clearHistory)
clearItemButton.addEventListener('click', clearItem)
saveButton.addEventListener('click',saveText)
dictateButton.addEventListener('click', dictateNext)
checkButton.addEventListener('click', checkNext)
evalButton.addEventListener('click', evaluate)
