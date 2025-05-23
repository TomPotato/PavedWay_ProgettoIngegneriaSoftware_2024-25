import api from './Api';

class AuthService {
    async login(username, password) {
        try {
            const response = await api.post('/auth/login', {
                username,
                password,
            });
            return response.data;
        } catch (error) {
            throw error.data  || error;
        }
    }

    async register(username, name, surname, email, password) {
        try {
            const response = await api.post('/auth/register', {
                username,
                name,
                surname,
                email,
                password,
            });
            return response.data;
        } catch (error) {
            throw error.data;
        }
    }
}

export default new AuthService();