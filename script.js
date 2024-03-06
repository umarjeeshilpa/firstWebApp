const incB = document.querySelector('#inc')
const decB = document.querySelector('#dec')
const cntEl = document.getElementById('counter')
const ulEl = document.getElementById('listItems')

let count = 0
const utterance = new SpeechSynthesisUtterance();

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
    utterance.text = "incremented to " + count;
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

incB.addEventListener('click',incF)
decB.addEventListener('click',decF)
