import axios from 'axios';

class Api {
    constructor(baseURL) {
        this.api = axios.create({
            baseURL,
        });
    }

    get(path, params = {}, config = {}) {
        return this.api.get(path, {
            params,
            ...config,
        });
    }

    post(path, body = {}, config = {}) {
        return this.api.post(path, body, config);
    }

    put(path, body = {}, config = {}) {
        return this.api.put(path, body, config);
    }

    patch(path, body = {}, config = {}) {
        return this.api.patch(path, body, config);
    }

    delete(path, config = {}) {
        return this.api.delete(path, config);
    }
}

const baseURL = import.meta.env.VITE_API_URL;
const apiInstance = new Api(baseURL);

export default apiInstance;
