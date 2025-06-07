import api from './Api';
import { useAuthStore } from '../stores/authStores';

class UserService {
    async getUsers(token, offset, limit) {
        const store = useAuthStore();

        try {
            const response = await api.get('/users', {
                params: {
                    offset: offset,
                    limit: limit
                }
            }, {
                headers: { 'x-api-key': token, }
            });
            return response.data;
        }
        catch (error) {
            throw error.data || error;
        }
    }

    async createUser(userData, token = null) {
        try {
            let config = {};
            if (token) {
                const headers = {
                    'x-api-key': token,
                };
                config = { headers: headers };
            }

            let body = {
                username: userData.username,
                name: userData.name,
                surname: userData.surname,
                password: userData.password,
                role: userData.role || 'citizen',
            }

            if (body.role === 'admin') {
                body.office = userData.office;
            } else if (body.role === 'citizen') {
                body.email = userData.email;
            }

            const response = await api.post('/users', body, config);
            return response.data;
        } catch (error) {
            throw error.data;
        }
    }

    async deleteUser(userId, token) {
        try {
            const response = await api.delete(`/users/${userId}`, {
                headers: { 'x-api-key': token }
            });
            return response.data;
        } catch (error) {
            throw error.data || error;
        }
    }
}

export default new UserService();
