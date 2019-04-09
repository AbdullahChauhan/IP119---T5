let startBtn = document.getElementById("start-btn");
let resetBtn = document.getElementById("reset-btn");
let lapBtn = document.getElementById("lap-btn");
let tickMilliSeconds = document.querySelector(".milliseconds-container");
let tickSeconds = document.querySelector(".seconds-container");
let tickMinutes = document.querySelector(".minutes-container");
let tickHours = document.querySelector(".hours-container");
let lapList = document.querySelector(".lap-list");
let deleteLap = document.querySelector(".delete-lap");

let hours = 0; 
let minutes = 0; 
let seconds = 0; 
let milliSeconds = 0;
let started = false;
let interval;
let laps = [];
let count = 0;

// load all event listeners
loadEventListeners();

function loadEventListeners() {
    // DOM load event
    document.addEventListener("DOMContentLoaded", getLaps);

    // start button event
    startBtn.addEventListener("click", start);

    // reset button event
    resetBtn.addEventListener("click", reset);

    // add lap button event
    lapBtn.addEventListener("click", addLap);

    // remove lap event
    lapList.addEventListener("click", removeLap);
}

// update time into UI
function updateTimer() {
    document.getElementById("timer").innerHTML = format(hours) + " : " + format(minutes) + " : " + format(seconds);
}

// format time "0" OR- "00"
function format(time) {
    return time > 9 ? time : "0" + time;
}

function timer() {
    tickMilliSeconds.style.animation = "rotate 1s infinite linear";
    tickSeconds.style.animation = "rotate 60s infinite steps(60)";
    tickMinutes.style.animation = "rotate 3600s infinite steps(60)";
    tickHours.style.animation = "rotate 43200s infinite steps(60)";
    
    // update the current time values to UI
    updateTimer();

    milliSeconds += 10;

    if (milliSeconds == 1000) {
        seconds += 1;
        milliSeconds = 0;
    }

    if (seconds == 60) {
        minutes += 1;
        seconds = 0;
    }

    if (minutes === 60) {
        hours += 1;
        minutes = 0;
    }

}

function start() {
    if (started == false) {
    tickMilliSeconds.style.visibility = "visible";

        startBtn.innerHTML = "PAUSE";
        interval = setInterval(timer, 10);
        started = true;
    } else {

        clearInterval(interval);
        started = false;
        startBtn.innerHTML = "START";

        tickMilliSeconds.style.animation =
            "rotate 1s infinite linear paused";
        tickSeconds.style.animation = "rotate 60s infinite steps(60) paused";
        tickMinutes.style.animation = "rotate 3600s infinite steps(60) paused";
        tickHours.style.animation = "rotate 43200s infinite steps(60) paused";
    }
}

function reset() {
    tickMilliSeconds.style.animation = "stopRotate";
    tickMilliSeconds.style.visibility = "hidden";
    tickSeconds.style.animation = "stopRotate";
    tickMinutes.style.animation = "stopRotate";
    tickHours.style.animation = "stopRotate";
    startBtn.innerHTML = " START ";
    clearInterval(interval);
    started = false;
    (milliSeconds = 0), (seconds = 0), (minutes = 0), (hours = 0);
    if (lapList.hasChildNodes()) {
        lapList.innerHTML = "";
    }
    updateTimer();
    localStorage.clear();
}

function addLap() {
    if (startBtn.textContent === "PAUSE") {
        laps.push([hours, minutes, seconds]);
        const li = document.createElement("li");
        li.appendChild(
            document.createTextNode(`Lap ${laps.length}:   ${hours}:${minutes}:${seconds}`)
        );
        const link = document.createElement("a");
        link.className = "delete-lap";
        link.innerHTML = `<i class="fas fa-times"></i>`;
        li.appendChild(link);
        lapList.appendChild(li);
        storeLapInLS(laps[count]);
        count++;
    }
}

function getLaps() {
    let laps;
    tickMilliSeconds.style.visibility = "hidden";
    if (localStorage.getItem("laps") === null) {
        laps = [];
    } else {
        laps = JSON.parse(localStorage.getItem("laps"));
    }

    laps.forEach(function(lap, index) {
        const li = document.createElement("li");
        li.appendChild(
            document.createTextNode(
                `Lap ${index + 1}:   ${lap[0]}:${lap[1]}:${lap[2]}`
            )
        );
        const link = document.createElement("a");
        link.className = "delete-lap";
        link.innerHTML = `<i class="fas fa-times"></i>`;
        li.appendChild(link);
        lapList.appendChild(li);
    });
}

function storeLapInLS(lap) {
    let laps;
    if (localStorage.getItem("laps") === null) {
        laps = [];
    } else {
        laps = JSON.parse(localStorage.getItem("laps"));
    }

    laps.push(lap);
    localStorage.setItem("laps", JSON.stringify(laps));
}

function removeLap(e) {
    if (e.target.parentElement.classList.contains("delete-lap")) {
        e.target.parentElement.parentElement.remove();
    }

    removeLapFromLocalStorage(e.target.parentElement.parentElement);
}

function removeLapFromLocalStorage(lapItem) {
    let laps;
    if (localStorage.getItem("laps") === null) {
        laps = [];
    } else {
        laps = JSON.parse(localStorage.getItem("laps"));
    }

    laps.forEach(function(lap, index) {
        if (
            lapItem.textContent.slice(9, 14).replace(/:/g, ",") === lap.join()
        ) {
            laps.splice(index, 1);
        }
    });

    localStorage.setItem("laps", JSON.stringify(laps));
}


