console.log("Version 0.001")
const saveButton = document.querySelector('#save')
const saveEl = document.getElementById('save')

const dictateButton = document.querySelector('#dictate')
const dictateButtonEl = document.getElementById('dictate')
dictateButtonEl.disabled = true

const checkButton = document.querySelector('#check')
const checkButtonEl = document.getElementById('check')
checkButtonEl.disabled = true

const evalButton = document.querySelector('#evaluate')
const evalEl = document.getElementById('evaluate')
evalEl.disabled = true

const ulEl = document.getElementById('listItems')
const textEl = document.getElementById('text')
const headEl = document.getElementById('headings')

let count = 0
let practiceTest = 1
let wordsToDictateLength = 0
let start = false

let words = []

const utterance = new SpeechSynthesisUtterance()
const voices = speechSynthesis.getVoices()
console.log(voices)
let voiceInfo = ""
for (let j = 0; j < voices.length; j++) {
	voiceInfo += voices[j].name + " " + voices[j].lang + " "
}
textEl.value = voiceInfo

let localWords = localStorage.getItem("words")
let localLen = localStorage.getItem("length")
if (voices.length > 0) {
	localLen = null
}
if (localLen != null) {
	wordsToDictateLength = parseInt(localLen)

	if (wordsToDictateLength != NaN) {
		words = localWords.replaceAll(',', ' ')
		console.log("wordsToDictateLength:" + wordsToDictateLength + " words:" + words)
		textEl.value = words
	}
}


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

function saveText() {
	
	let textInput = textEl.value
	textInput = textInput.replaceAll(' ', '\n')
	words = textInput.split( "\n" )	
	textEl.value = ""
	console.log(words)
	console.log(words.length)
	count = 0
	start = false
	
	// randomize
	
	let length = words.length - 1
	if (words.length === 0) {
		length = 0
	} else {
		saveEl.disabled = true
		dictateButtonEl.disabled = false
	}
		
	wordsToDictateLength = words.length
	localStorage.setItem("words", words)
	localStorage.setItem("length", wordsToDictateLength)
	shuffle(words)
}


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
		headEl.innerText = "Practice Dictation:" + practiceTest + " voice option:" + voices.length
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
    setTimeout(() => {dictateButtonEl.disabled = false;}, 10100);    
}

function dictateNext() {
	dictateNextInternal(words)
}

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
	li.innerHTML = '<label><input id="checkbox'+ count + '" type="checkbox"><b> Word </b>' + count + ' ' + word + '</label>'
	utterance.text = word
    	speechSynthesis.speak(utterance)
	setTimeout(() => {checkButtonEl.disabled = false;}, 2000);
		
}

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
		checkBox.disabled = true
	}
	
	utterance.text = "You got " + (length - incorrect) + "out of " + length
	speechSynthesis.speak(utterance)
	
	if (incorrect == 0) {
		utterance.text = "Congratulations, no more practice test"
		speechSynthesis.speak(utterance)
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

saveButton.addEventListener('click',saveText)
dictateButton.addEventListener('click', dictateNext)
checkButton.addEventListener('click', checkNext)
evalButton.addEventListener('click', evaluate)
