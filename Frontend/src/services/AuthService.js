import api from './Api';

class AuthService {
    async login(username, password) {
        const response = await api.post('/auth/login', {
            username,
            password,
        });
        return response.data;
    }

    async register(username, name, surname, email, password) {
        const response = await api.post('/auth/register', {
            username,
            name,
            surname,
            email,
            password,
        });
        return response.data;
    }
}

export default new AuthService();