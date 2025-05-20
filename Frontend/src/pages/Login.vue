<template>
    <div class="flex flex-col items-center">
        <fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
            <legend class="fieldset-legend">Accedi</legend>

            <label class="label">Nome utente</label>
            <input v-model="username" type="text" class="input" placeholder="Nome utente" required />

            <label class="label">Password</label>
            <input v-model="password" type="password" class="input" placeholder="Password" required />

            <button class="btn btn-neutral mt-4" @click="login" :disabled="!username || !password">
                Accedi
            </button>
        </fieldset>
        <p class="mt-5 ">Non hai un account? <router-link to="/register"
                class="text-link underline">Registrati</router-link></p>
    </div>
    <div class="toast">
        <div v-if="successMessage" role="alert" class="alert alert-success">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ successMessage }}</span>
        </div>
        <div v-if="errorMessage" role="alert" class="alert alert-error">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ errorMessage }}</span>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStores';

const username = ref('');
const password = ref('');
const errorMessage = ref(null);
const successMessage = ref(null);

const store = useAuthStore();
const router = useRouter();

const login = async () => {
    errorMessage.value = null;
    successMessage.value = null;

    await store.login(username.value, password.value);

    if (store.isAuthenticated) {
        successMessage.value = 'Login effettuato con successo!';
    } else {
        errorMessage.value = store.error;
    }
};
</script>
