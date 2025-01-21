const fs = require('fs');
const path = require('path');

exports.getQuestion = () => {
    const questionsFilePath = path.resolve(__dirname, '../data/questions/questions.txt');
    const fileContent = fs.readFileSync(questionsFilePath, 'utf-8');

    const questions = fileContent.split('\n').map(line => {
        const [id, text] = line.split('|');
        return { id: parseInt(id), text };
    });
    return questions;
};

exports.getAnswer = () => {
    const answersFilePath = path.resolve(__dirname, '../data/answers/answers.txt');
    const fileContent = fs.readFileSync(answersFilePath, 'utf-8');

    // ERROR FIND LOG 💥
    // const answers = fileContent.split('|').map(answer => answer.trim());
    
    const answers = fileContent.split('\n').map(line => {
        const [id, text] = line.split('|');
        return { id: parseInt(id), text };
    });
    return answers;
};