<template>
    <div class="flex flex-col items-center">
        <fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
            <legend class="fieldset-legend">Registrati</legend>

            <label class="label">Nome utente</label>
            <input v-model="username" type="text" class="input" placeholder="Nome utente" required />
            <p v-if="!validateUsername" class="text-error">
                Il nome utente deve avere una lunghezza tra 3 e 20 caratteri e
                può contenere solo lettere, numeri e trattini bassi
            </p>

            <label class="label">Email</label>
            <input v-model="email" type="email" class="input" placeholder="Email" required />
            <p v-if="!validateEmail" class="text-error">
                L'email non è valida
            </p>

            <label class="label">Nome</label>
            <input v-model="name" type="text" class="input" placeholder="Nome" required />
            <p v-if="!validateName" class="text-error">
                Il nome deve avere una lunghezza superiore a 2 caratteri e
                può contenere solo lettere, spazi, apostrofi o trattini
            </p>

            <label class="label">Cognome</label>
            <input v-model="surname" type="text" class="input" placeholder="Cognome" required />
            <p v-if="!validateSurname" class="text-error">
                Il cognome deve avere una lunghezza superiore a 2 caratteri e
                può contenere solo lettere, spazi, apostrofi o trattini
            </p>

            <label class="label">Password</label>
            <input v-model="password" type="password" class="input" placeholder="Password" required />
            <p v-if="!validatePassword" class="text-error">
                La password deve avere una lunghezza minima di 8 caratteri e
                contenere almeno una lettera, un numero e un carattere speciale
            </p>

            <label class="label">Verifica password</label>
            <input v-model="passwordVerify" type="password" class="input" placeholder="Verifica password" required />
            <p v-if="password !== passwordVerify" class="text-error">
                Le password non coincidono
            </p>

            <button class="btn btn-neutral mt-4" @click="register"
                :disabled="!validateUsername || !validateEmail || !validateName || !validateSurname || !validatePassword || !validatePasswordVerify">
                Registrati
            </button>
        </fieldset>
        <p class="mt-5 ">Hai già un account? <router-link to="/login" class="text-link underline">Accedi</router-link>
        </p>
    </div>
    <div class="toast">
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
import { computed } from 'vue';
import { useRouter } from 'vue-router';

import { useAuthStore } from '@/stores/authStores';
import validator from '@/utils/Validator';

const username = ref('');
const email = ref('');
const name = ref('');
const surname = ref('');
const password = ref('');
const passwordVerify = ref('');
const errorMessage = ref(null);

const validateUsername = computed(() => {
    return !username.value ? true : validator.validateUsername(username.value);
});

const validateEmail = computed(() => {
    return !email.value ? true : validator.validateEmail(email.value);
});

const validateName = computed(() => {
    return !name.value ? true : validator.validateName(name.value);
});

const validateSurname = computed(() => {
    return !surname.value ? true : validator.validateName(surname.value);
});

const validatePassword = computed(() => {
    return !password.value ? true : validator.validatePassword(password.value);
});

const validatePasswordVerify = computed(() => {
    return password.value === passwordVerify.value;
});

const validateForm = computed(() => {
    return (
        username.value &&
        email.value &&
        name.value &&
        surname.value &&
        password.value &&
        passwordVerify.value &&
        validateUsername.value &&
        validateEmail.value &&
        validateName.value &&
        validateSurname.value &&
        validatePassword.value &&
        validatePasswordVerify.value
    );
});

const store = useAuthStore();
const router = useRouter();

const register = async () => {
    errorMessage.value = null;
    await store.register(username.value, name.value, surname.value, email.value, password.value);

    if (store.isAuthenticated) {
        const redirectPath = store.originalPath || '/';
        store.clearRedirect();
        store.setMessage('Registrazione effettuata con successo!');
        router.push({ path: redirectPath });
    } else {
        errorMessage.value = store.error;
    }
};
</script>
