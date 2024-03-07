
const saveButton = document.querySelector('#save')
const dictateButton = document.querySelector('#dictate')
const checkButton = document.querySelector('#check')
const ulEl = document.getElementById('listItems')
const textEl = document.getElementById('text')

let count = 0
let start = false

let words = []
const utterance = new SpeechSynthesisUtterance()

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
	}
	let temp = ""
	
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

function dictateNext() {
	if (words.length == 1 && words[0] == "") {
		console.log("write words in text box and press save")
		utterance.text = "Write words in text box and press save. Then press dictate"
		speechSynthesis.speak(utterance)		
	}
	if (words.length == count) {
		console.log("disable start dictation")
		utterance.text = "Done with dictation. Press Check Dictation to check"
		speechSynthesis.speak(utterance)
		return
	}
	
	let word = words[count]
	count++
    
    //create
    const li = document.createElement('li')
    li.setAttribute('data-counter',count)
    
    li.innerHTML = '<b> Word </b>' + count
	utterance.text = word
    speechSynthesis.speak(utterance)
	
	
    //append
    ulEl.appendChild(li)
}

function checkNext() {
	console.log(start)
	if (start && (count == words.length)) {
		console.log("Done check Dictation")
		utterance.text = "Done with check dictation"
		speechSynthesis.speak(utterance)
		return
	}else if (!start && (words.length == count)) {
		count = 0
		start = true
	} 
		
	let word = words[count]
	count++
    
    //create
    const li = document.createElement('li')
    li.setAttribute('data-counter',count)
    
    li.innerHTML = '<b> Word </b>' + count + ' ' + word
	utterance.text = word
    speechSynthesis.speak(utterance)
	
	
    //append
    ulEl.appendChild(li)
}

saveButton.addEventListener('click',saveText)
dictateButton.addEventListener('click', dictateNext)
checkButton.addEventListener('click', checkNext)
