const pomodoro = 'POMODORO';
const breakTime = 'BREAK';
const longBreak = 'LONG-BREAK';

const running = 'RUNNING';
const extra = 'EXTRA';
const stopState = 'STOP';

const millisInSecond = 300;

let secondsTotal = 0;
let mode = pomodoro;
let programState = stopState;
let intervalFunc = false;

let startButton = document.getElementById('start-button');
let controlButton = document.getElementById('stop-button');
let endButton = document.getElementById('end-button');
let timerElement = document.getElementById('timer');
let pomodoroInput = document.getElementById('pomodoro-time');
let breakInput = document.getElementById('break-time');
let longBreakInput = document.getElementById('long-break-time');

let inputActive = pomodoroInput;

const getUpdateTimer = () => {

    let timerString = ``;

    //Determine if increase or decrease count depending on state
    if (programState == running) {
        if (secondsTotal > 0) {
            secondsTotal --;
        } else {
            programState = extra;
            secondsTotal ++;
        }
    } else if (programState == extra) {
        secondsTotal ++;
    }

    let hours = Math.floor(secondsTotal / (60 * 60));
    let minutes = Math.floor(secondsTotal / 60) % 60;
    let seconds = secondsTotal % 60;

    //Build the timer string to show

    if (hours > 0){
        timerString += `${hours}:`;
    }
    if (minutes < 10) {
        timerString += `0${minutes}:`;
    } else {
        timerString += `${minutes}:`;
    }
    if (seconds < 10) {
        timerString += `0${seconds}`;
    } else {
        timerString += `${seconds}`;
    }

    return timerString;
}

const updateTimerElement = () => {
    let timerString = getUpdateTimer();
    timerElement.textContent = timerString;
}

const checkInputNumber = (intMinutes) => Number.isInteger(intMinutes) && intMinutes < 60 && intMinutes > 0;

startButton.addEventListener('click', () => {

    //Check if no other timer is running
    if (intervalFunc === false && programState == stopState) {
        let setMinutes = inputActive.value;
        let intMinutes = Number(setMinutes);

        //Check if input is integer and inside parameter
        if (checkInputNumber(intMinutes)) {
            secondsTotal = setMinutes * 60 + 1;
            intervalFunc = setInterval(updateTimerElement, millisInSecond);
            programState = running;
        }
    }
})

controlButton.addEventListener('click', () => {
    //Check if interval is running, delete it if so and change legend
    if (intervalFunc) {
        clearInterval(intervalFunc);
        intervalFunc = false;
        controlButton.innerText = 'Continue';
    } else {
        intervalFunc = setInterval(updateTimerElement, millisInSecond);
        controlButton.innerText = 'Stop';
    }
})

endButton.addEventListener('click', () => {

    //Stop interval if running
    if (intervalFunc) {
        clearInterval(intervalFunc);
        intervalFunc = false;
    } 

    if (controlButton.innerText == 'Continue') {
        controlButton.innerHTML = 'Stop';
    }

    programState = stopState;
    let setMinutes = inputActive.value;

    //Reset shown timer
    if (checkInputNumber(Number(setMinutes))) {
        secondsTotal = setMinutes * 60;
        updateTimerElement();
    }


})

