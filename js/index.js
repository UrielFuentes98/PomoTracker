const pomodoro = "POMODORO";
const breakTime = "BREAK";
const longBreak = "LONG-BREAK";

const running = "RUNNING";
const extra = "EXTRA";
const stopState = "STOP";

const millisInSecond = 100;

let secondsTotal = 0;
let mode = pomodoro;
let programState = stopState;
let intervalFunc = false;
let pomodoros = 0;
let alarm = new Audio('sounds/alarm_sound.mp3');
let buttonClick = new Audio('sounds/click.mp3');

let titleElement = document.getElementsByTagName("title")[0];
let startButton = document.getElementById("start-button");
let controlButton = document.getElementById("stop-button");
let endButton = document.getElementById("end-button");
let timerElement = document.getElementById("timer");
let finishElement = document.getElementById("pomodoro-finish");
let breakFinishElement = document.getElementById("break-finish");
let pomodoroInput = document.getElementById("pomodoro-time");
let breakInput = document.getElementById("break-time");
let longBreakInput = document.getElementById("long-break-time");
let pomodoroCheckbox = document.getElementById("pomodoro-checkbox");
let breakCheckbox = document.getElementById("break-checkbox");
let longBreakCheckbox = document.getElementById("long-break-checkbox");

let inputActive = pomodoroInput;

const activatePomodoroInput = () => {
  pomodoroCheckbox.checked = true;
  breakCheckbox.checked = false;
  longBreakCheckbox.checked = false;
  mode = pomodoro;
  inputActive = pomodoroInput;
};

const activateBreakInput = () => {
  pomodoroCheckbox.checked = false;
  breakCheckbox.checked = true;
  longBreakCheckbox.checked = false;
  mode = breakTime;
  inputActive = breakInput;
};

const activateLongBreakInput = () => {
  pomodoroCheckbox.checked = false;
  breakCheckbox.checked = false;
  longBreakCheckbox.checked = true;
  mode = longBreak;
  inputActive = longBreakInput;
};

const getUpdateTimer = () => {
  let timerString = ``;

  //Determine if increase or decrease count depending on state
  if (programState == running) {
    if (secondsTotal > 0) {
      secondsTotal--;
    } else {
      programState = extra;
      secondsTotal++;
      if (mode == pomodoro) {
        finishElement.style.display = "block";
      } else if (mode == breakTime || mode == longBreak) {
        breakFinishElement.style.display = "block";
      }
      alarm.play();
    }
  } else if (programState == extra) {
    secondsTotal++;
  }

  let hours = Math.floor(secondsTotal / (60 * 60));
  let minutes = Math.floor(secondsTotal / 60) % 60;
  let seconds = secondsTotal % 60;

  //Build the timer string to show

  if (hours > 0) {
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
};

//Function to get first part of title string depending on mode and timer state

const getTitleStringTemplate = () => {

  let titleString = '';

  if (programState == stopState) {

    if (mode == pomodoro) {
      titleString = 'Start Pomodoro';
    } else if (mode == breakTime) {
      titleString = 'Start Break';
    } else if (mode == longBreak) {
      titleString = 'Start Long Break';
    }

  } else if (programState == extra) {
    titleString = 'Extra - ';
  } else if (mode == pomodoro) {
    titleString = 'Pomodoro - ';
  } else if (mode == breakTime) {
    titleString = 'Break - ';
  } else if (mode == longBreak) {
    titleString = 'Long Break - ';
  }

  return titleString;
}

//Update app timer and title string.

const updateTimerElement = () => {
  let timerString = getUpdateTimer();
  let titleString = '';
  titleString = getTitleStringTemplate();

  if (programState != stopState) {
    titleString += timerString;
  }

  timerElement.textContent = timerString;
  titleElement.textContent = titleString;
};

const checkInputNumber = (intMinutes) =>
  Number.isInteger(intMinutes) && intMinutes < 60 && intMinutes > 0;

startButton.addEventListener("click", () => {
  //Check if no other timer is running
  if (intervalFunc === false && programState == stopState) {
    let setMinutes = inputActive.value;
    let intMinutes = Number(setMinutes);

    //Check if input is integer and inside parameter
    if (checkInputNumber(intMinutes)) {
      buttonClick.play();
      secondsTotal = setMinutes * 60 + 1;
      intervalFunc = setInterval(updateTimerElement, millisInSecond);
      programState = running;
    }
  }
});

controlButton.addEventListener("click", () => {
  //Check if interval is running, delete it if so and change legend
  if (programState != stopState) {
    buttonClick.play();
    if (intervalFunc) {
      clearInterval(intervalFunc);
      intervalFunc = false;
      controlButton.innerText = "Continue";
    } else {
      intervalFunc = setInterval(updateTimerElement, millisInSecond);
      controlButton.innerText = "Stop";
    }
  }
});

endButton.addEventListener("click", () => {
  //Stop interval if running and check next timer value
  if (intervalFunc) {
    clearInterval(intervalFunc);
    intervalFunc = false;
  }

  if (programState != stopState) {
    //If in pomodoro mode check if it ended and update to timer to
    //correct break time.
    buttonClick.play();
    if (mode == pomodoro) {
      if (programState == extra) {
        pomodoros++;

        if (pomodoros >= 3) {
          activateLongBreakInput();
          pomodoros = 0;
        } else {
          activateBreakInput();
        }
        finishElement.style.display = "none";
      } else {
        activatePomodoroInput();
      }
    } else {
      breakFinishElement.style.display = "none";
      activatePomodoroInput();
    }
  }

  if (controlButton.innerText == "Continue") {
    controlButton.innerHTML = "Stop";
  }

  programState = stopState;
  let setMinutes = inputActive.value;

  //Reset shown timer
  if (checkInputNumber(Number(setMinutes))) {
    secondsTotal = setMinutes * 60;
    updateTimerElement();
  }
});

pomodoroCheckbox.addEventListener("click", () => {
  if (programState == stopState) {
    activatePomodoroInput();
  } else {
    if (mode == pomodoro) {
      pomodoroCheckbox.checked = true;
    } else {
      pomodoroCheckbox.checked = false;
    }
  }
});

breakCheckbox.addEventListener("click", () => {
  if (programState == stopState) {
    activateBreakInput();
  } else {
    if (mode == breakTime) {
      breakCheckbox.checked = true;
    } else {
      breakCheckbox.checked = false;
    }
  }
});

longBreakCheckbox.addEventListener("click", () => {
  if (programState == stopState) {
    activateLongBreakInput();
  } else {
    if (mode == longBreakCheckbox) {
      longBreakCheckbox.checked = true;
    } else {
      longBreakCheckbox.checked = false;
    }
  }
});
