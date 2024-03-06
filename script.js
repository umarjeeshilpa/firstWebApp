const incB = document.querySelector('#inc')
const decB = document.querySelector('#dec')
const saveButton = document.querySelector('#save')
const dictateButton = document.querySelector('#dictate')
const cntEl = document.getElementById('counter')
const ulEl = document.getElementById('listItems')
const textEl = document.getElementById('text')



let count = 0

let words = []
const utterance = new SpeechSynthesisUtterance()

function incF() {
    
    count++
    cntEl.innerText = count

    //create
    const li = document.createElement('li')
    li.setAttribute('data-counter',count)
    if (count %2 === 0) {
        //li.setAttribute('class', 'red')
        li.style.background = 'red'
    } else {
        li.setAttribute('class', 'yellow')
    }
    li.innerHTML = '<b> Sentence </b>' + count
	utterance.text = "incremented to " + count
    speechSynthesis.speak(utterance);
    //append
    console.log(li)
    ulEl.appendChild(li)
}

function decF() {
    const li = ulEl.querySelector('[data-counter="'+count+'"]')
    const number = parseInt(li.getAttribute('data-counter'),10)
    if (number % 2 === 0) {
        li.remove()
    }
    count--
    cntEl.innerText = count
}

function saveText() {
	
	let textInput = textEl.value
	words = textInput.split( "\n" )
	textEl.value = ""
	console.log(words)
}
function dictateNext() {
	if (words.length == count) {
		console.log("disable start dictation")
		return;
	}
	let word = words[count]
	count++
    cntEl.innerText = word

    //create
    const li = document.createElement('li')
    li.setAttribute('data-counter',count)
    
    li.innerHTML = '<b> Word </b>' + count
	utterance.text = word
    speechSynthesis.speak(utterance);
	
    //append
    ulEl.appendChild(li)
}
incB.addEventListener('click',incF)
decB.addEventListener('click',decF)
saveButton.addEventListener('click',saveText)
dictateButton.addEventListener('click', dictateNext)
