import axios from 'axios';
import { showAlert } from './alerts';

export const updateRole = async (user_id, role) => {
    try {
        const res = await axios({
            method: 'PATCH',
            url: `http://127.0.0.1:3000/api/v1/users/updateRole/${user_id}`,
            data: { role }
        });

        if (res.data.status === 'success') {
            showAlert(
                'success', 
                'Update role in successfully!'
            );
            return Promise.resolve();
        }
    } catch (err) {
        showAlert(
            'error', 
            err.response.data.message
        );
        return Promise.reject(err);
    }
};

export const setQuiz = async (questionLimit, quizTime, shuffle, autoSubmit) => {
    try {
        const res = await axios({
            method: 'POST',
            url: 'http://127.0.0.1:3000/api/v1/quiz/setQuiz',
            data: {
                questionLimit, 
                quizTime, 
                shuffle, 
                autoSubmit
            }
        });

        if (res.data.status === 'success') {
            showAlert(
                'success', 
                'Quiz add successfully!'
            );
        }
    } catch (err) {
        showAlert(
            'error', 
            err.response.data.message
        );
    }
};

export const startQuiz = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:3000/api/v1/quiz/startQuiz'
    });

    if (res.data.status === 'success') {
      return res.data;
    }
  } catch (err) {
    showAlert(
      'error',
      err.response?.data?.message || 'Something went wrong'
    );
  }
};

export const activeQuiz = async() => {
    try {
        let res = await axios({
            method: 'GET',
            url: 'http://127.0.0.1:3000/api/v1/quiz/active'
        });

        if (res.data.status === 'success') {
            return res.data.quiz;
        }
    } catch (err) {
        return null;
    }
};

export const subAttQuiz = async(data) => {
    try {
        const res = await axios({
            method: 'POST',
            url: 'http://127.0.0.1:3000/api/v1/quiz-attempts/submit',
            data,
            withCredentials: true
        });

        return res.data;
    } catch (err) {
        showAlert(
            'error',
            err.response?.data?.message || 'Submit failed'
        );
    }
};

export const getResult = async(attempt_id) => {
    try { 
        const res = await axios({
            method: 'GET',
            url: `http://127.0.0.1:3000/api/v1/quiz-attempts/result/${attempt_id}`
        });

        return res.data;
    } catch (err) {
        showAlert(
            'error', 
            err.response.data.message
        );
    }
};

export const getAdminStats = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:3000/api/v1/admin/dashboard',
      withCredentials: true
    });

    return res.data.stats;
  } catch (err) {
    showAlert(
        'error', 
        'Failed to load dashboard stats'
    );
  }
};

export const getStudentStats = async () => {
    try {
        const res = await axios({
            method: 'GET',
            url: 'http://127.0.0.1:3000/api/v1/students/dashboard',
            withCredentials: true
        });

        return res.data.stats;
    } catch (err) {
        showAlert(
            'error',
            'Failed to load student stats'
        );
    }
};