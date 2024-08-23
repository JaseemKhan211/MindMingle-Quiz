import '@babel/polyfill';
import { login, logout } from './login';

// DOM ELEMENTS
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');


// DELEGATION
if(loginForm)
loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const user_id = document.getElementById('user_id').value;
    const password = document.getElementById('password').value;
    login( user_id, password );
});

if (logOutBtn) logOutBtn.addEventListener('click', logout);