
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

let count = 0
let start = false

let words = []
const utterance = new SpeechSynthesisUtterance()

function shuffle(words) {
	
	let length = words.length - 1
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
	let temp = ""
	
	shuffle(words)
}

function dictateNext() {
	
	if (dictateButtonEl.disabled) {
		console.log("Disabled")
		return
	}
	dictateButtonEl.disabled = true	
	if (words.length == 1 && words[0] == "") {
		console.log("write words in text box and press save")
		utterance.text = "Write words in text box and press save. Then press dictate"
		speechSynthesis.speak(utterance)
		return
	}
	if (words.length == count) {
		console.log("disable start dictation")
		utterance.text = "Done with dictation. Press Check Dictation to check"
		speechSynthesis.speak(utterance)
		checkButtonEl.disabled = false
		return
	}
	
	let word = words[count]
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
	//setTimeout(() => {  speechSynthesis.speak(utterance); }, 5000);
	//setTimeout(() => {  speechSynthesis.speak(utterance); }, 10000);
	//setTimeout(() => {dictateButtonEl.disabled = false;}, 10100);
	dictateButtonEl.disabled = false
}

function checkNext() {
	
	console.log(start)
	if (start && (count == words.length)) {
		console.log("Done check Dictation")
		utterance.text = "Done with check dictation"
		speechSynthesis.speak(utterance)
		checkButtonEl.disabled = true
		evalEl.disabled = false
		return
	}else if (!start && (words.length == count)) {
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
		
}

function evaluate() {
	let length = words.length
	let correct = 0
	for (i = 1; i <= length; i++) {
		let id = "checkbox" + i
		const checkBox = document.getElementById(id)
		if (checkBox.checked) {
			correct++;
		}
	}
	utterance.text = "You got " + correct + "out of " + length
	speechSynthesis.speak(utterance)
}

saveButton.addEventListener('click',saveText)
dictateButton.addEventListener('click', dictateNext)
checkButton.addEventListener('click', checkNext)
evalButton.addEventListener('click', evaluate)
