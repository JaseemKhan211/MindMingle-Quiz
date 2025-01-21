import axios from 'axios';
import { showAlert } from './alerts';

export const raiseQuestion = async (questionId, time) => {
    try {

        // ERROR 💥 Log the error
        // console.log('Raising question with ID:', questionId, 'and time:', time);

        const res = await axios({
            method: 'POST',
            url: 'http://127.0.0.1:3000/api/v1/data/raiseQuestion',
            data: {
                questionId,
                time
            },
            timeout: 5000
        }).catch(err => {
            console.error('API call failed:', err);
        });

        // ERROR 💥 Log the error
        // console.log('raiseQuestion response =>', res.data);
        // console.log('raiseQuestion response =>', res);

        if (res.data.status === 'success') {
            console.log(res.data.status);
            showAlert('success', 'Question raised successfully!');
            window.setTimeout(() => {
              location.assign('/');
            }, 1500);
        }
    } catch (err) {

        // ERROR 💥 Log the error
        // console.error('ERROR 💥', err);
        // console.log('Error occurred:', err); 

        showAlert('error', err.response?.data?.message || 'Something went wrong!');
    }
}