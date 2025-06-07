import { defineStore } from 'pinia';
import { ref, computed, watchEffect } from 'vue';
import { jwtDecode } from 'jwt-decode';
import authService from '../services/AuthService';
import userService from '../services/UserService';

export const useAuthStore = defineStore('auth', () => {
    const token = ref(null);
    const user = ref(null);
    const error = ref(null);

    const originalPath = ref(null);
    const message = ref(null);

    const isAuthenticated = computed(() => token.value !== null);
    const isAdmin = computed(() => user.value?.role === 'admin');
    const isCitizen = computed(() => user.value?.role === 'citizen');
    const isExpired = computed(() => {
        if (!token.value) return true;

        try {
            const decoded = jwtDecode(token.value);
            return decoded.exp * 1000 < Date.now();
        } catch (error) {
            return true;
        }
    });

    const login = async (username, password) => {
        try {
            const response = await authService.login(username, password);
            token.value = response.token;
            user.value = response.user;
            error.value = null;
        } catch (e) {
            error.value = e.message;
            token.value = null;
            user.value = null;
        }
    };

    const register = async (userData) => {
        try {
            await userService.createUser(userData, token.value);
            const response = await authService.login(userData.username, userData.password);
            token.value = response.token;
            user.value = response.user;
            error.value = null;
        } catch (e) {
            error.value = e.message;
            token.value = null;
            user.value = null;
        }
    };

    const logout = () => {
        token.value = null;
        user.value = null;
    }

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

    watchEffect(() => {
        if (token.value && isExpired.value) {
            logout();
        }
    });

    return {
        token,
        user,
        error,
        isAuthenticated,
        isAdmin,
        isCitizen,
        isExpired,
        originalPath,
        message,
        login,
        register,
        logout,
        setRedirect,
        clearRedirect,
        setMessage,
        clearMessage,
    };
}, {
    persist: true,
});
