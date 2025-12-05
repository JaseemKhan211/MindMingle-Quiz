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