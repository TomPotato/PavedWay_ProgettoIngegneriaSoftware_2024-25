import api from './Api';

class AuthService {
    async login(username, password) {
        try {
            const response = await api.post('/authentication', {
                username,
                password,
            });
            return response.data;
        } catch (error) {
            throw error.data || error;
        }
    }
}

export default new AuthService();