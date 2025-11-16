import flatpickr from "flatpickr";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import "flatpickr/dist/flatpickr.min.css";

let userSelectedDate = null;
let timerId = null;

const dataInput = document.querySelector('#datetime-picker');
const startButton = document.querySelector('[data-start]');
const days = document.querySelector('[data-days]');
const hours = document.querySelector('[data-hours]');
const minutes = document.querySelector('[data-minutes]');
const seconds = document.querySelector('[data-seconds]');

startButton.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    const startTime = new Date();

    if(selectedDate < startTime) {
        iziToast.error({
            title: 'Error',
            message: 'Please choose a date in the future',
            position: 'topRight'
        });
        startButton.disabled = true;
    }
    else {
        startButton.disabled = false;
        userSelectedDate = selectedDate;
    }
  },
};

flatpickr(dataInput, options);

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
    const valueString = String(value);
    const formattedValue = valueString.padStart(2, '0');

    return formattedValue;
}

startButton.addEventListener('click', function(e) {
    if(userSelectedDate === null) {
        return;
    }
    startButton.disabled = true;
    dataInput.disabled = true;

    timerId = setInterval(() => {
        const currentTime = new Date();
        const deltaTime = userSelectedDate - currentTime;

        if(deltaTime <= 0) {
            clearInterval(timerId);
            dataInput.disabled = false;
            return;
        }

        const timeComponents = convertMs(deltaTime);
        const { days, hours, minutes, seconds } = timeComponents;
        document.querySelector('[data-days]').textContent = addLeadingZero(days);
        document.querySelector('[data-hours]').textContent = addLeadingZero(hours);
        document.querySelector('[data-minutes]').textContent = addLeadingZero(minutes);
        document.querySelector('[data-seconds]').textContent = addLeadingZero(seconds);

  }, 1000); 
});