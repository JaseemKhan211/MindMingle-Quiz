import io from 'socket.io-client'; 
import { WaitingAlert } from './sweetAlert';

const socket = io();

socket.on('questionRaised', ({ question, answers }) => {
    console.log('New question received:', question);
    if (!question) {
        console.log('No question raised yet.');
        WaitingAlert();
        return;
    }

    // Update the DOM to display the question and answers in real-time
    const questionSection = document.querySelector('.question-section');
    questionSection.innerHTML = `
        <div class="question-text">${question}</div>
        <form class="quiz-form" action="/submitAnswer" method="POST">
            ${answers.map((answer, index) => `
                <div class="answer-item">
                    <input type="radio" name="answer" value="${answer}" required>
                    <label>${answer}</label>
                </div>
            `).join('')}
            <button class="submit-btn" type="submit">Submit Answer</button>
        </form>
    `;
});