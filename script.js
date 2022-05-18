const progressPixelWidth = 300

/*question elements store the text for the job-title inside a span, and they
directly store the math question*/
const question = document.querySelectorAll(".question")
//progress elements are the divs that grow to make the loading bars
const progress = document.querySelectorAll(".progress")
const input = document.querySelector(".input")
const money = document.querySelector(".money")
const questionsAnswered = document.querySelector(".questions-answered")

/*progress elements get a bool to check if it's loading (can't answer problems
if it's still loading) and a loadingTime variable to tell it how long to load*/
progress.forEach((e) => e.isProgressRunning = false)
/*question elements store their own operators, loadingTimes, operand max,
$/question answered (payday) and job title*/
const operatorList = ['+','-','+','-','*','/','+','-','*','/']
const loadingTime = [17, 29, 49, 84, 142, 241, 410, 698, 1186, 2016]
const operandMax = [5,5,25,25,5,5,100,100,10,10]
const payday = [1,2,5,10,20,50,100,250,500,1000]
const job = ['Burger-Flipper','Waitress','Garbageman','Teacher','Firefighter',
'Lawyer','Doctor','Programmer','Politician','Oligarch']
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
    question[i].children[1].textContent += generateQuestion(question[i])
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

//returns a string for the question
function generateQuestion(element) {
    let a = Math.floor(Math.random() * element.operandMax) + 1
    let b = Math.floor(Math.random() * element.operandMax) + 1
    if(element.operator === '/') a = b * a
    else if(element.operator === '-' && a < b) {
        const temp = a
        a = b
        b = temp
    }
    return `${a} ${element.operator} ${b} = ${element.selector}`
}

function checkAnswers(element) {
    const a = element.children[1].textContent.split(' ', 3)
    switch (a[1]) {
        case('+') : return parseInt(a[0]) + parseInt(a[2])
        case('-') : return parseInt(a[0]) - parseInt(a[2])
        case('*') : return parseInt(a[0]) * parseInt(a[2])
        case('/') : return parseInt(a[0]) / parseInt(a[2])
    }
}

//if you get the selected question right
function updateScore(element) {
    const tempArray = questionsAnswered.textContent.split(" ")
    let tempArray2 = money.textContent.split(" ")
    tempArray2[1] = tempArray2[1].substring(1)
    a = parseInt(tempArray[2]) + 1
    b = parseInt(tempArray2[1]) + parseInt(element.payday)
    questionsAnswered.textContent = 'Questions Answered: ' + a
    money.textContent = "Money: $" + b 
}

//when you press one of the letter-selectors
function selectorPress(entry) {
    entry = entry.toLowerCase();
    const selectedQuestion = document.getElementById(entry)
    const selectedProgress = document.getElementById(entry + "Progress")
    if(checkAnswers(selectedQuestion) == input.textContent &&
    !selectedProgress.isProgressRunning) {
        progressBar(selectedProgress)
        updateScore(selectedQuestion)
        selectedQuestion.children[1].textContent = generateQuestion(selectedQuestion)
    }
    input.textContent = '0'
    return;
}

window.addEventListener('keydown', (e) => {
    if(e.key >= 0 && e.key <=9 && input.textContent.length < 8) {
        if(input.textContent == '0') input.textContent = e.key;
        else input.textContent += e.key
    }
    if("asdfgzxcvbASDFGZXCVB".includes(e.key)) selectorPress(e.key)
})

question.forEach(e => e.onclick = function() {selectorPress(e.selector)})