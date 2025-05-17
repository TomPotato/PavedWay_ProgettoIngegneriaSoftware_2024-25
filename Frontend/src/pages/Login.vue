<template>
    <h1>Login</h1>
    <form @submit.prevent="login">
        <div>
            <label for="username">Username:</label>
            <input type="text" id="username" v-model="username" required />
        </div>
        <div>
            <label for="password">Password:</label>
            <input type="password" id="password" v-model="password" required />
        </div>
        <button type="submit">Login</button>
        <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>
        <p v-if="successMessage" style="color: green;">{{ successMessage }}</p>
    </form>
    <p>Non hai un account? <router-link to="/register">Registrati</router-link></p>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStores';

const username = ref('');
const password = ref('');
const errorMessage = ref(null);
const successMessage = ref(null);

const authStore = useAuthStore();
const router = useRouter();

const login = async () => {
    errorMessage.value = null;
    successMessage.value = null;

    await authStore.login(username.value, password.value);

    if (authStore.isAuthenticated) {
        successMessage.value = 'Login effettuato con successo!';
        // router.push('/dashboard');
    } else {
        errorMessage.value = authStore.error || 'Login fallito. Riprova.';
    }
};
</script>
