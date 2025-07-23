import '@babel/polyfill';
import { login, logout } from './login';
import { updateSettings } from './updateSettings';
import { raiseQuestion } from './raiseQuestion';
import { WaitingAlert, myError, noLoginAlert } from './sweetAlert';
import { showAlert } from './alerts';

// DOM ELEMENTS
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const raiseButtons = document.querySelectorAll('.raise-btn');
const questionText = document.querySelector('.question-text');
const notLogin = document.querySelector('.start-btn');

// DELEGATION
if(loginForm)
loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const user_id = document.getElementById('user_id').value;
    const password = document.getElementById('password').value;
    login( user_id, password );
});

if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (userDataForm)
    userDataForm.addEventListener('submit', e => {
      e.preventDefault();
      const username = document.getElementById('username').value;
      const email = document.getElementById('email').value;
      updateSettings({ username, email }, 'data');
});

if(raiseButtons)
raiseButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const questionId = btn.getAttribute('data-question-id');
        const timeInput = document.querySelector(`.time-input[data-question-id='${questionId}']`);
        const time = timeInput ? parseInt(timeInput.value) : 30; 

        // ERROR 💥 Log the error
        // console.log('Button clicked. Question ID:', questionId, 'Time:', time);

        if (isNaN(time) || time <= 0) {
            return showAlert('error', 'Please enter a valid time for the question!');
        } else {

            // ERROR 💥 Log the error
            // console.log(`Don't worry user time successfuly passed`); 
        }

        raiseQuestion(questionId, time);
    });
});

if(questionText)
questionText.addEventListener('DOMContentLoaded', () => {
    if (questionText && questionText.textContent.includes('Please wait')) {
        WaitingAlert();
    }
});

if(notLogin) {
    notLogin.addEventListener('click', (e) => {
        e.preventDefault();
        noLoginAlert();
    });
}