import { defineStore } from 'pinia';

import service from '../services/AuthService';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: null,
        user: null,
        error: null,
    }),
    actions: {
        async login(username, password) {
            try {
                const { token } = await service.login(username, password);
                this.token = token;
                this.error = null;
            } catch (e) {
                this.error = e.message;
            }
        },
        async register(username, name, surname, email, password) {
            try {
                const { token } = await service.register(username, name, surname, email, password);
                this.token = token;
                this.error = null;
            } catch (e) {
                this.error = e.message;
            }
        },
    },
});