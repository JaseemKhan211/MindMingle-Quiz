module.exports = (io) => {
  const { getQuestionAndAnswers } = require('./studentController');

  return {
      raiseQuestion: async (req, res) => {
        try {

          // ERROR FIND LOG 💥
          // console.log('raiseQuestion API hit! Data received:', req.body);

          const { questionId } = req.query;

          // ERROR FIND LOG 💥
          // console.log('request query adminController.js file: ', req.query);

          const { question, answers } = getQuestionAndAnswers(questionId);

          // ERROR FIND LOG 💥
          // console.log('response question id adminController.js file: ', questionId);

          if (question) {
            io.emit('questionRaised', { question, answers });
            res.status(200).send('Question Raised');
          } else {
            res.status(404).send('Question not found');

            return res.status(404).json({ message: 'Question not found' });
          }

        } catch (err) {

          // ERROR FIND LOG 💥
          // console.error('Error in raiseQuestion:', err);

          res.status(500).send('Internal Server Error');
        }
      }
  };
};