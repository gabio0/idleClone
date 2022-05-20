/*question elements store the text for the job-title inside a span, and they
directly store the math question*/
const question = document.querySelectorAll(".question")
//progress elements are the divs that grow to make the loading bars
const progress = document.querySelectorAll(".progress")
const input = document.querySelector(".input")
const money = document.querySelector(".money")
const questionsAnswered = document.querySelector(".questions-answered")
const displayMoneySeconds = document.querySelector(".money-seconds")
const displayStatus = document.querySelector(".status")
const columnRight = document.querySelector(".column-right")
const resetMenu = document.querySelector('.reset')
const hideJobs = document.querySelector('.jobs')
const resetText = document.querySelector('.reset-text')
let columnRightContentStorage = ''
/*progress elements get a bool to check if it's loading (can't answer problems
if it's still loading) and a loadingTime variable to tell it how long to load*/
progress.forEach((e) => e.isProgressRunning = false)
/*question elements store their own operators, loadingTimes, operand max,
$/question answered (payday) and job title*/
const operatorList = ['+','-','+','-','*','/','+','-','*','/']
const loadingTime = [17, 29, 49, 84, 142, 241, 410, 698, 1186, 2016]
const operandMax = [5,5,25,25,5,5,100,100,10,10]
const payday = [1,2,5,10,25,75,200,450,1000,5000]
const job = ['Troll Poop cleaner','Narwhal Breeder','Dragon Groomer','Magical Zoologist','Hydra Slayer', 'Wildcat Trainer','Alchemist','Wizard','White Mage','Unicorn Rider']
const selector = ['A','S','D','F','G','Z','X','C','V','B']
const peonBaseCosts = [10,50,200,1000,3500,10000,50000,300000,2000000,10000000]
const peonNames = ['Hobo Temp A','Little Girl S','Fan Boy D','Scientist F','Knight G','Tank Z','Insane Old Guy X','Creepy Hag C','Best Friend V','Master B']
const statusItem = ['Hair Cut A', 'New Shoes S', 'Hire Maid D', 'New Car F', 'Fly First Class G', 'Hire Chocolatier Z', 'Live-in Nanny X', 'Beach House C', 'Name a Library V', 'Tophat & Monocle B']
const statusCost = [30,150,500,2000,7500,18000,50000,500000,3000000,10000000]
const statusPointValue = [1,4,9,16,25,37,50,65,82,99]
let inHireMenu = false
let inStatusMenu = false
let inResetMenu = false
let moneyPerSecond = 0
let statusPoints = 0
let isMoneyPerSecondRunning = false;
let unicornSpirits = 0
let seconds

//loading additional element attributes
function resetElementAttributes(){
    for(let i=0;i<question.length;i++) {
        question[i].operator = operatorList[i]
        question[i].operandMax = operandMax[i]
        question[i].selector = selector[i]
        question[i].payday = payday[i] * (1+(unicornSpirits/10))
        question[i].job = job[i]
        question[i].countHired = 0;
        question[i].peonCost = peonBaseCosts[i]
        question[i].peonName = peonNames[i]
        question[i].statusItem = statusItem[i]
        question[i].statusCost = statusCost[i]
        question[i].statusPointValue = statusPointValue[i]
        question[i].children[1].textContent += generateQuestion(question[i])
        progress[i].loadingTime = loadingTime[i]
    }
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

//checking answers relies on the string-math questions following this specific format # <operator> #
function checkAnswers(element) {
    const a = element.children[1].textContent.split(' ', 3)
    switch (a[1]) {
        case('+') : return parseFloat(a[0]) + parseFloat(a[2])
        case('-') : return parseFloat(a[0]) - parseFloat(a[2])
        case('*') : return parseFloat(a[0]) * parseFloat(a[2])
        case('/') : return parseFloat(a[0]) / parseFloat(a[2])
    }
}

//if you get the selected question right
function updateScore(element) {
    const tempArray = questionsAnswered.textContent.split(" ")
    a = parseFloat(tempArray[2]) + 1
    b = getDisplayMoney() + parseFloat(element.payday)
    unicornSpirits++
    questionsAnswered.textContent = 'Questions Answered: ' + a
    setDisplayMoney(b)
}

//when you press one of the letter-selectors
function questionSelected(entry) {
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

function backToMainScreen() {
    input.textContent = '0'
    input.style = 'font-size: 60px;'
    for(let i=0;i<question.length;i++) {
        question[i].children[0].textContent = `$${question[i].payday} ${question[i].job}`
        question[i].children[1].textContent = generateQuestion(question[i])
    }
}

function openHireMenu() {
    inHireMenu = !inHireMenu
    inStatusMenu = false
    if(inResetMenu) {
        openResetMenu()
        openHireMenu()
    }
    if(inHireMenu){
        input.style = 'font-size: 31px;'
        input.textContent = 'Hire Some Peons!'
        for(let i=0;i<question.length;i++) {
            question[i].children[0].textContent = `Cost $${question[i].peonCost} to hire:`
            question[i].children[1].textContent = `${peonNames[i]}`
        }
    } else backToMainScreen()
}

function openStatusMenu() {
    inStatusMenu = !inStatusMenu
    inHireMenu = false
    if(inResetMenu) {
        openResetMenu()
        openStatusMenu()
    }
    if(inStatusMenu) {
        input.style = 'font-size: 31px;'
        input.textContent = 'Be Cooler!'
        for(let i=0;i<question.length;i++) {
            question[i].children[0].textContent = `Cost $${question[i].statusCost} for a`
            question[i].children[1].textContent = question[i].statusItem
            console.log('test')
        }
    } else backToMainScreen()
}

function openResetMenu() {
    inResetMenu = !inResetMenu
    inStatusMenu = false
    inHireMenu = false
    input.style = 'font-size: 26px;'
    input.textContent = 'Permanent Upgrades!'
    resetText.textContent = `Reset all your money, status, and hired peons in exchange for ${unicornSpirits} Unicorn Spirits?`
    if(inResetMenu) {
        hideJobs.style = 'opacity: 0;'
        resetMenu.style = 'opacity: 1;'
    } else {
        hideJobs.style = 'opacity: 1;'
        resetMenu.style = 'opacity: 0;'
        backToMainScreen()
    }
}

function updateMoneyPerSecond(){
    if(isMoneyPerSecondRunning) clearInterval(seconds)
    let a = 0;
    for(let i=0;i<question.length;i++){
        a += (question[i].countHired * question[i].payday) / (progress[i].loadingTime * .3)
    }
    moneyPerSecond = a.toFixed(2)
    unicornSpirits++
    seconds = setInterval(moneySeconds, 1000)
    function moneySeconds() {
        isMoneyPerSecondRunning = true;
        b = getDisplayMoney() + parseFloat(moneyPerSecond)
        setDisplayMoney(b.toFixed(2))
    }
    displayMoneySeconds.textContent = '$' + moneyPerSecond + '/second'
}

function getDisplayMoney() {
    let a = money.textContent.split('$')
    return parseFloat(a[1])
}

function setDisplayMoney(m) {
    money.textContent = "Money: $" + m
}

function adjustDisplayMoney(a) {
    const b = getDisplayMoney()
    const c = (b - a).toFixed(2)
    money.textContent = "Money: $" + c
    return
}

function canIAfford(a) {
    const b = getDisplayMoney()
    if(b >= a) {
        return true
    } else return false
}

function someoneHired(entry) {
    const selectedQuestion = document.getElementById(entry)
    if(canIAfford(selectedQuestion.peonCost)){
        adjustDisplayMoney(selectedQuestion.peonCost)
        selectedQuestion.countHired++
        selectedQuestion.peonCost = (selectedQuestion.peonCost * 1.5).toFixed(2)
        selectedQuestion.children[0].textContent = `Cost $${selectedQuestion.peonCost} to hire:`
        updateMoneyPerSecond()
    }
    return;
}

function statusPurchase(entry) {
    const selectedQuestion = document.getElementById(entry)
    if(canIAfford(selectedQuestion.statusCost)){
        unicornSpirits++
        adjustDisplayMoney(selectedQuestion.statusCost)
        selectedQuestion.statusCost = (selectedQuestion.statusCost * 1.5).toFixed(2)
        selectedQuestion.children[0].textContent = `Cost $${selectedQuestion.statusCost} for a`
        statusPoints += selectedQuestion.statusPointValue
        displayStatus.textContent = `You are a: POOR with ${statusPoints} status`
    }
}

function resetPurchase(entry) {
    setDisplayMoney(0)
    questionsAnswered.textContent = 'Questions Answered: 0'
    displayStatus.textContent = "You are a: POOR with 0 Status"
    resetElementAttributes()
    updateMoneyPerSecond()
}

resetElementAttributes()

window.addEventListener('keydown', (e) => {
    const a = e.key.toLowerCase();
    if(a >= 0 && a <=9 && input.textContent.length < 8) {
        if(input.textContent == '0') input.textContent = a;
        else input.textContent += a
    }
    if("asdfgzxcvbASDFGZXCVB".includes(a)) {
        if(inStatusMenu) statusPurchase(a)
        else if(inHireMenu) someoneHired(a)
        else if(inResetMenu) resetPurchase(a)
        else questionSelected(a)
    }
    if('rR'.includes(a) && inResetMenu) resetPurchase(a)
    if(a === 'w') openHireMenu()
    if(a === 'q') openStatusMenu()
    if(a === 'e') openResetMenu()
})

//question.forEach(e => e.onclick = function() {questionSelected(e.selector)})q
