import '@babel/polyfill';
import "@fortawesome/fontawesome-free/js/all.min.js";
import { login, logout } from './login';
import { updateSettings } from './updateSettings';
import { raiseQuestion } from './raiseQuestion';
import { WaitingAlert, noLoginAlert } from './sweetAlert';
import { showAlert } from './alerts';

// DOM ELEMENTS
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const raiseButtons = document.querySelectorAll('.raise-btn');
const questionText = document.querySelector('.question-text');
const notLogin = document.querySelector('.start-btn-notlogin');
const pwField = document.getElementById('password');
const togglePw = document.getElementById('togglePw');
const icon = togglePw ? togglePw.querySelector('i') : null;

// DELEGATION
if(loginForm)
loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const user_id = document.getElementById('user_id').value;
    const password = document.getElementById('password').value;
    login( user_id, password );
});

if (logOutBtn) logOutBtn.addEventListener('click', logout);

// if (userDataForm)
//     userDataForm.addEventListener('submit', e => {
//       e.preventDefault();
//       const username = document.getElementById('name').value;
//       const email = document.getElementById('email').value;
//       updateSettings({ username, email }, 'data');
// });

if (userDataForm)
  userDataForm.addEventListener('submit', e => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    console.log(form);

    updateSettings(form, 'data');
  });

if (userPasswordForm)
  userPasswordForm.addEventListener('submit', async e => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );

    document.querySelector('.btn--save-password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
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
};

if (togglePw && pwField && icon) {
  togglePw.addEventListener('click', () => {
    if (pwField.type === 'password') {
      pwField.type = 'text';
      icon.classList.remove('fa-eye');
      icon.classList.add('fa-eye-slash');
    } else {
      pwField.type = 'password';
      icon.classList.remove('fa-eye-slash');
      icon.classList.add('fa-eye');
    }
  });
}