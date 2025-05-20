import axios from 'axios';

class Api {
    constructor(baseURL) {
        this.api = axios.create({
            baseURL,
        });
    }

    async get(path, params = {}, config = {}) {
        try {
            return await this.api.get(path, {
                params,
                ...config,
            });
        } catch (error) {
            throw error.response;
        }
    }

    async post(path, body = {}, config = {}) {
        try {
            return await this.api.post(path, body, config);
        } catch (error) {
            throw error.response;
        }
    }

    async put(path, body = {}, config = {}) {
        try {
            return await this.api.put(path, body, config);
        } catch (error) {
            throw error.response;
        }
    }

    async patch(path, body = {}, config = {}) {
        try {
            return await this.api.patch(path, body, config);
        } catch (error) {
            throw error.response;
        }
    }

    async delete(path, config = {}) {
        try {
            return await this.api.delete(path, config);
        } catch (error) {
            throw error.response;
        }
    }
}

const baseURL = import.meta.env.VITE_API_URL;
const apiInstance = new Api(baseURL);

export default apiInstance;
