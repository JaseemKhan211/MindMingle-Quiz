const { getQuestion, getAnswer } = require('./dataController');

exports.getQuestionAndAnswers = (questionId) => {
  
    // 1) GET the questions and answers
    const questions = getQuestion();
    const answers = getAnswer();

    // 2) Find the question with the given ID
    const question = questions.find(q => q.id === parseInt(questionId));

    // ERROR FIND LOG 💥
    // console.log('Question ', question);

    // 3) Get the answers associated with the same question ID
    const relevantAnswers = answers
      .filter(answer => answer.id === parseInt(questionId))
      .map(answer => answer.text);

    // 4) Return the question and its corresponding answers
    return { question: question.text, answers: relevantAnswers };
};