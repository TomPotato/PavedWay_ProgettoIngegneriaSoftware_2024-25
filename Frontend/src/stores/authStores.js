import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import service from '../services/AuthService';

export const useAuthStore = defineStore('auth', () => {
    const token = ref(null);
    const user = ref(null);
    const error = ref(null);

    const originalPath = ref(null);
    const message = ref(null);

    const isAuthenticated = computed(() => token.value !== null);

    const login = async (username, password) => {
        try {
            const response = await service.login(username, password);
            token.value = response.token;
            user.value = response.user;
            error.value = null;
        } catch (e) {
            error.value = e.message;
            token.value = null;
            user.value = null;
        }
    };

    const register = async (username, name, surname, email, password) => {
        try {
            const response = await service.register(username, name, surname, email, password);
            token.value = response.token;
            user.value = response.user;
            error.value = null;
        } catch (e) {
            error.value = e.message;
            token.value = null;
            user.value = null;
        }
    };

    const setRedirect = (path) => {
        originalPath.value = path;
    };

    const clearRedirect = () => {
        originalPath.value = null;
    };

    const setMessage = (msg) => {
        message.value = msg;
    };

    const clearMessage = () => {
        message.value = null;
    };

    return {
        token,
        user,
        error,
        isAuthenticated,
        originalPath,
        message,
        login,
        register,
        setRedirect,
        clearRedirect,
        setMessage,
        clearMessage,
    };
});
