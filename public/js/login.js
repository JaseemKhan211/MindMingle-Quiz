import axios from 'axios';
import { showAlert } from './alerts';

export const login = async (usrid, pw) => {
    console.log(`Attempting to log in with usrid: ${usrid} and pw: ${pw}`);

    try{
        const res = await axios({
            method: 'GET',
            url: 'https://apex.oracle.com/pls/apex/jasorcel/userservices/login',
            params: {
                usrid,
                pw
            }
        });

        console.log('Response:', res);  // Log the entire response

        // Parse the JSON data from the response
        const data = JSON.parse(res.data.split('\n')[1]);

        if(data.status === 'Success') {
            console.log(data.message);
            showAlert('success', 'Logged in successfully!');
            window.setTimeout(() => {
              location.assign('/');
            }, 1500);
        } else {
            console.log('Unexpected status:', res.data.status);
            showAlert('error', res.data.message);
        }
    } catch(err){
        if(err.response){
            console.log('Error response:', err.response);  // Log the error response
            showAlert('error', err.response.data.message);
        } else{
            console.error('Error:', err);
            showAlert('error', 'An unexpected error occurred.');
        }
    }
}