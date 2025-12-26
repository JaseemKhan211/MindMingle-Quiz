import '@babel/polyfill';
import "@fortawesome/fontawesome-free/js/all.min.js";
import Swal from 'sweetalert2';
import Chart from 'chart.js/auto';
import { signUp, login, logout } from './login';
import { updateSettings } from './updateSettings';
import { updateRole, setQuiz, startQuiz, activeQuiz, subAttQuiz, getAdminStats } from './updateAPI';
import { raiseQuestion } from './raiseQuestion';
import { WaitingAlert, noLoginAlert } from './sweetAlert';
import { showAlert } from './alerts';

// DOM ELEMENTS
const signForm = document.querySelector('.form--signup');
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
const quizForm = document.querySelector('.form--setQuiz');
const startQuizBtn = document.querySelector('.start-btn');

// DOM ELEMENTS: Quiz Logic
const questionTEXT = document.querySelector('.question-text');
const optionsGroup = document.querySelector('.options-group');
const nextBtn = document.querySelector('.btn--green');
const timerEl = document.querySelector('.timer');
const questionCount = document.querySelector('.question-count');
const quIZForm = document.querySelector('#quizForm');
const dashboard = document.querySelector('.dashboard');
const tableBody = document.querySelector('#recentAttemptsBody');

// DELEGATION
if(signForm)
  signForm.addEventListener('submit', e => {
    e.preventDefault();
    const user_id = document.getElementById('user_id').value;
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    signUp( user_id, username, email, password, passwordConfirm );
  }
);

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
    const form = new FormData();
    form.append('username', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

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
};

document.addEventListener('DOMContentLoaded', () => {
  const roleSelects = document.querySelectorAll('.role--select');

  if (roleSelects.length > 0) {
    roleSelects.forEach(select => {
      select.addEventListener('change', (e) => {
        e.preventDefault();

        const user_id = e.target.getAttribute('data-user-id');
        const role = e.target.value;

        updateRole(user_id, role)
          .then(() => {
            e.target.classList.add('updated');
          })
          .catch(err => {
            alert('❌ Error updating role');
          });
      });
    });
  }
});

if(quizForm)
  quizForm.addEventListener('submit', e => {
    e.preventDefault();
    const questionLimit = document.getElementById('questionLimit').value;
    const quizTime = document.getElementById('quizTime').value;
    const shuffle = document.getElementById('shuffle').value;
    const autoSubmit = document.getElementById('autoSubmit').value;
    setQuiz(questionLimit, quizTime, shuffle, autoSubmit);
  });

if (startQuizBtn) {
  startQuizBtn.addEventListener('click', async (e) => {
    if (!e.isTrusted) return;

    const quiz = await activeQuiz();

    // 🛑 CASE 1: Admin has not started quiz
    if (!quiz) {
      WaitingAlert();
      return;
    }

    // ✅ CASE 2: Quiz is active
    const result = await Swal.fire({
      title: '📘 Quiz Instructions',
      width: 520,
      html: `
        <ul class="quiz-info">
          <li>📝 <b>Questions:</b> ${quiz.questionLimit}</li>
          <li>⏱ <b>Time Limit:</b> ${quiz.quizTime} minutes</li>
          <li>⚡ <b>Auto Submit:</b> When time ends</li>
          <li>🚫 <b>Warning:</b> Do not refresh the page</li>
        </ul>
        <p style="margin-top:10px;font-size:14px;color:#666">
          Once started, the quiz cannot be paused.
        </p>
      `,
      showCancelButton: true,
      confirmButtonText: 'Start Quiz',
      cancelButtonText: 'Not Now',
      confirmButtonColor: '#55c57a'
    });

    if (result.isConfirmed) {
      window.location.href = '/quiz';
    }
  });
}

// ===============================
// QUIZ STATE
// ===============================
let questions = [];
let currentIndex = 0;
let answers = [];
let timerInterval;
let autoSubmit = false;

// ===============================
// INIT
// ===============================
const initQuiz = async () => {
  const data = await startQuiz();

  if (!data) return;

  questions = data.questions;
  autoSubmit = data.autoSubmit;

  startTimer(data.quizTime);
  renderQuestion();
};

// ===============================
// RENDER QUESTION
// ===============================
const renderQuestion = () => {
  const q = questions[currentIndex];

  questionCount.textContent = `Question ${currentIndex + 1} of ${questions.length}`;
  questionTEXT.textContent = q.question;

  optionsGroup.innerHTML = '';

  q.options.forEach(opt => {
    optionsGroup.insertAdjacentHTML(
      'beforeend',
      `
      <label class="option">
        <input type="radio" name="answer" value="${opt}">
        <span>${opt}</span>
      </label>
      `
    );
  });
};

// ===============================
// NEXT BUTTON LOGIC
// ===============================
if (quIZForm && nextBtn) {
  nextBtn.addEventListener('click', e => {
    e.preventDefault();

    const selected = document.querySelector('input[name="answer"]:checked');

    if (!selected) {
      alert('Please select an option');
      return;
    }

    answers[currentIndex] = {
      question: questions[currentIndex]._id,
      selectedAnswer: selected.value
    };

    currentIndex++;

    if (currentIndex < questions.length) {
      renderQuestion();
    } else {
      submitQuiz();
    }
  });

  // ✅ Start quiz ONLY on quiz page
  initQuiz();
}

// ===============================
// TIMER
// ===============================
const startTimer = minutes => {
  let time = minutes * 60;

  timerInterval = setInterval(() => {
    const min = Math.floor(time / 60);
    const sec = time % 60;

    timerEl.textContent = `⏱ ${min}:${sec < 10 ? '0' : ''}${sec}`;

    time--;

    if (time < 0) {
      clearInterval(timerInterval);
      if (autoSubmit) submitQuiz();
    }
  }, 1000);
};

// ===============================
// SUBMIT QUIZ
// ===============================
const submitQuiz = async () => {
  clearInterval(timerInterval);

  const result = await subAttQuiz({ answers });

  if (!result) return;

  if (result?.attemptId) {
    window.location.href = `/quiz/result/${result.attemptId}`;
  }
  
  // showAlert('success', 'Quiz submitted!');
};

const loadAdminDashboard = async () => {
  if (!dashboard) return;

  const stats = await getAdminStats();
  if (!stats) return;

  // Numbers
  document.querySelector('#totalQuizzes').textContent = stats.totalQuizzes;
  document.querySelector('#activeQuizzes').textContent = stats.activeQuizzes;
  document.querySelector('#totalStudents').textContent = stats.totalStudents;
  document.querySelector('#totalAttempts').textContent = stats.totalAttempts;
  document.querySelector('#avgScore').textContent = stats.avgScore;

  // Recent Attempts
  const tbody = document.querySelector('#recentAttempts');
  tbody.innerHTML = '';

  stats.recentAttempts.forEach(a => {
    tbody.insertAdjacentHTML(
      'beforeend',
      `
      <tr>
        <td>${a.user.username}</td>
        <td>${a.quiz._id}</td>
        <td>${a.score}</td>
      </tr>
      `
    );
  });

  console.log(stats.attemptsPerQuiz);
  console.log(stats.avgScore);

  // Charts
  renderCharts(stats);

  console.log(stats.attemptsPerQuiz);
  console.log(stats.avgScore);

};

const renderCharts = (stats) => {

  const attemptCtx = document.getElementById('attemptChart');
  if (attemptCtx) {
    new Chart(attemptCtx, {
      type: 'bar',
      data: {
        labels: stats.attemptsPerQuiz.map(q => q.quiz),
        datasets: [{
          label: 'Attempts',
          data: stats.attemptsPerQuiz.map(q => q.count)
        }]
      }
    });
  }

  const scoreCtx = document.getElementById('scoreChart');
  if (scoreCtx) {
    new Chart(scoreCtx, {
      type: 'doughnut',
      data: {
        labels: ['Average Score', 'Remaining'],
        datasets: [{
          data: [stats.avgScore, 10 - stats.avgScore]
        }]
      }
    });
  }
};

loadAdminDashboard();
