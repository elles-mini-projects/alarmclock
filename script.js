// Initial References
let timerRef = document.querySelector(".time-display");
const hourInput = document.getElementById("hourInput");
const minInput = document.getElementById("minInput")
const activeAlarms = document.querySelector(".activeAlarms");

const setAlarm = document.getElementById("setAlarm");

let alarmsArr = [];

let alarmSound = new Audio("./slowmotion.mp3")

let initHour = 0,
initMin = 0,
alarmIndex = 0;

// Appending zeroes for single digit
const appendZero = (value) => (value < 10 ? "0" + value : value)

// Search for value in object
const searchObj = (parameter, value) =>
{
    let alarmObj,
    objIndex,
    exists = false;
    alarmsArr.forEach((alarm, index) =>
    {
        if(alarm[parameter] == value)
        {
            exists = true;
            alarmObj = alarm;
            objIndex = index;
            return false;
        }
    });

    return [exists, alarmObj, objIndex];
}

// Display Time
function displayTimer()
{
    let date = new Date()
    let [hours, minutes, seconds] =
    [
        appendZero(date.getHours()),
        appendZero(date.getMinutes()),
        appendZero(date.getSeconds()),
    ];

    // Display Time
    timerRef.innerHTML = `${hours}:${minutes}:${seconds}`;

    // Alarm
    alarmsArr.forEach((alarm, index) =>
    {
        if(alarm.isActive)
        {
            if(`${alarm.alarmHour}:${alarm.alarmMinute}` === `${hours}:${minutes}`)
            {
                alarmSound.play();
                alarmSound.loop = true;
            }
        }
    });
}

const inputCheck = (inputValue) =>
{
    inputValue = parseInt(inputValue);
    if(inputValue < 10)
    {
        inputValue = appendZero(inputValue);
    }

    return inputValue;
}

hourInput.addEventListener("input", () =>
{
    hourInput.value = inputCheck(hourInput.value);
});

minInput.addEventListener("input", () =>
{
    minInput.value = inputCheck(minInput.value);
});

// Create alarm div
const createAlarm = (alarmObj) =>
{
    // Keys from obj
    const {id, alarmHour, alarmMinute} = alarmObj;

    // Alarm div
    let alarmDiv = document.createElement("div")
    alarmDiv.classList.add("alarm")
    alarmDiv.setAttribute("data-id", id);
    alarmDiv.innerHTML = `<span> ${alarmHour}: ${alarmMinute} </span>`;

    // Checkbox
    let checkbox = document.createElement("input")
    checkbox.setAttribute("type", "checkbox")
    checkbox.addEventListener("click", (e) =>
    {
        if(e.target.checked)
        {
            startAlarm(e);
        }
        else
        {
            stopAlarm(e);
        }
    });

    alarmDiv.appendChild(checkbox);

    // Delete button
    let deleteBtn = document.createElement("button")
    deleteBtn.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
    deleteBtn.classList.add("deleteBtn")
    deleteBtn.addEventListener("click", (e) => deleteAlarm(e))
    alarmDiv.appendChild(deleteBtn);
    activeAlarms.appendChild(alarmDiv);
};

// Set Alarm
setAlarm.addEventListener("click", () =>
{
    alarmIndex += 1;

    // alarmObj
    let alarmObj = {};
    alarmObj.id = `${alarmIndex}_${hourInput.value}_${minInput.value}`;
    alarmObj.alarmHour = hourInput.value;
    alarmObj.alarmMinute = minInput.value;
    alarmObj.isActive = false;
    console.log(alarmObj);
    alarmsArr.push(alarmObj);
    createAlarm(alarmObj);
    hourInput.value = appendZero(initHour);
    minInput.value = appendZero(initMin);
});

// startAlarm
const startAlarm = (e) =>
{
    let searchId = e.target.parentElement.getAttribute("data-id");
    let [exists, obj, index] = searchObj("id", searchId);
    if(exists)
    {
        alarmsArr[index].isActive = true;
    }
}

const stopAlarm = (e) =>
{
    let searchId = e.target.parentElement.getAttribute("data-id");
    let [exists, obj, index] = searchObj("id", searchId);

    if(exists)
    {
        alarmsArr[index].isActive = false;
        alarmSound.pause();
    }
};

// Delete Alarm
const deleteAlarm = (e) =>
{
    let searchId = e.target.parentElement.parentElement.getAttribute("data-id");
    let [exists, obj, index] = searchObj("id", searchId);

    if(exists)
    {
        e.target.parentElement.parentElement.remove();
        alarmsArr.splice(index, 1);
    }
};

window.onload = () =>
{
    setInterval(displayTimer);
    initHour = 0;
    initMin = 0;
    alarmIndex = 0;
    alarmsArr = [];
    hourInput.value = appendZero(initHour);
    minInput.value = appendZero(initMin)
}