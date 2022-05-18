const progressPixelWidth = 300

const question = document.querySelectorAll(".question")
const progress = document.querySelectorAll(".progress")
const input = document.querySelector(".input")
const money = document.querySelector(".money")
const questionsAnswered = document.querySelector(".questionsAnswered")

progress.forEach((e) => e.isProgressRunning = false)
const operatorList = ['+','-','+','-','*','/','+','-','*','/']
const loadingTime = [17, 29, 49, 84, 142, 241, 410, 698, 1186, 2016]
const operandMax = [5,5,25,25,5,5,100,100,10,10]
const payday = [1,2,5,10,20,50,100,250,500,1000]
const job = ['Burger-Flipper','Waitress','Garbageman','Teacher','Firefighter','Lawyer','Doctor','Programmer','Politician','Oligarch']
let selector = ['A','S','D','F','G','Z','X','C','V','B']


for(let i=0;i<progress.length;i++) {
    progress[i].loadingTime = loadingTime[i]
}

for(let i=0;i<question.length;i++) {
    question[i].operator = operatorList[i]
    question[i].operandMax = operandMax[i]
    question[i].selector = selector[i]
    question[i].payday = payday[i]
    question[i].job = job[i]
    question[i].innerHTML += generateQuestion(question[i])
}

function progressBar(element) {
    element.isProgressRunning = true
    let width = 1
    let id = setInterval(frame, element.loadingTime)
    element.style.width = '1px'
    function frame() {
        if (width >= 300) {
            clearInterval(id)
            element.isProgressRunning = false;
        } else {
            width++
            element.style.width = `${width}px`
        }
    }
}

function generateQuestion(element) {
    let a = Math.floor(Math.random() * element.operandMax) + 1
    let b = Math.floor(Math.random() * element.operandMax) + 1
    if(element.operator === '/') a = b * a
    else if(element.operator === '-' && a < b) {
        const temp = a
        a = b
        b = temp
    }
    return `<br /><strong>${a} ${element.operator} ${b} = ${element.selector}&nbsp;<strong>`
}

function checkAnswers(element) {
    const a = element.textContent.split(' ', 5)
    switch (a[3]) {
        case('+') : return parseInt(a[2]) + parseInt(a[4])
        case('-') : return parseInt(a[2]) - parseInt(a[4])
        case('*') : return parseInt(a[2]) * parseInt(a[4])
        case('/') : return parseInt(a[2]) / parseInt(a[4])
    }
}

function updateScore(element) {
    const tempArray = questionsAnswered.textContent.split(" ")
    let tempArray2 = money.textContent.split(" ")
    tempArray2[1] = tempArray2[1].substring(1)
    a = parseInt(tempArray[2]) + 1
    b = parseInt(tempArray2[1]) + parseInt(element.payday)
    questionsAnswered.textContent = 'Questions Answered: ' + a
    money.textContent = "Money: $" + b 
}

window.addEventListener('keydown', (e) => {
    if(e.key >= 0 && e.key <=9 && input.textContent.length < 8) {
        if(input.textContent == '0') input.textContent = e.key;
        else input.textContent += e.key
    }
    if("asdfgzxcvb".includes(e.key)) {
        const selectedQuestion = document.getElementById(e.key)
        const selectedProgress = document.getElementById(e.key + "Progress")
        if(checkAnswers(selectedQuestion) == input.textContent && !selectedProgress.isProgressRunning) {
            progressBar(selectedProgress)
            updateScore(selectedQuestion)
            selectedQuestion.innerHTML = `<span class="l">$${selectedQuestion.payday} ${selectedQuestion.job} </span>${generateQuestion(selectedQuestion)}`
        }
        input.textContent = '0'
    }
})