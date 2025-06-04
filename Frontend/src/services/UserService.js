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
}

export default new UserService();
