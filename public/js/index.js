import '@babel/polyfill';
import { login } from './login';

// DOM ELEMENTS
const loginForm = document.querySelector('.form--login');


// DELEGATION
if(loginForm)
loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const usrid = document.getElementById('usrid').value;
    const pw = document.getElementById('pw').value;
    login( usrid, pw );
});