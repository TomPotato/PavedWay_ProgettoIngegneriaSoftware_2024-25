<template>
    <div v-if="ready" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div class="card bg-base-100 shadow-xl h-40">
            <div class="card-body flex items-center justify-center flex-col">
                <h2 class="card-title">Aggiungi amministratore</h2>
                <button class="btn btn-square btn-primary drawer-button p-5 w-15 h-15"
                    @click="openModal('AmministratoreCrea')">
                    <img src="/add.svg" />
                </button>
            </div>
        </div>
        <div v-for="user in users" :key="user.id" class="card bg-base-100 shadow-xl min-h-40">
            <div class="card-body">
                <h2 class="card-title">{{ user.name }} {{ user.surname }}{{ user.id === store.user.id ? ' (tu)' : '' }}
                </h2>
                <p>{{ user.email || user.office }}</p>
                <div class="card-actions justify-end">
                    <button class="btn btn-primary" @click="goToUserInfo(user.id)">Info</button>
                    <button class="btn btn-secondary" @click="openModal('UtentiElimina', user.id)">Elimina</button>
                </div>
            </div>
        </div>
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
    <RedirectMessage />

    <dialog id="UtentiElimina" class="modal">
        <div class="modal-box max-w-md w-full">
            <h3 class="text-lg font-bold">Eliminazione</h3>
            <p class="py-2">{{ userId === store.user.id ? "Sei sicuro di volerti eliminare?"
                : "Sei sicuro di voler eliminare questo utente?" }} Questa azione è irreversibile</p>
            <div class="modal-action">
                <form method="dialog" class="flex flex-row gap-2">
                    <button class="btn btn-neutral" @click="deleteUser()">Elimina</button>
                    <button class="btn btn-neutral" @click="closeModal('UtentiElimina')">Annulla</button>
                </form>
            </div>
        </div>
        <form method="dialog" class="modal-backdrop">
            <button @click="closeModal('UtentiElimina')">Annulla</button>
        </form>
    </dialog>

    <dialog id="AmministratoreCrea" class="modal">
        <div class="modal-box bg-base-200 border-base-300 w-auto p-4 flex flex-col max-h-[80vh]">
            <div class="overflow-y-auto p-4 flex-1">
                <fieldset class="fieldset gap-2 w-xs" @keyup.enter="addAdmin">
                    <legend class="fieldset-legend">Aggiungi Amministratore</legend>

                    <label class="label">Nome utente</label>
                    <input id="default" v-model="username" type="text" class="input" placeholder="Nome amministratore"
                        required />
                    <p v-if="!validateUsername" class="text-error">
                        Il nome utente deve avere una lunghezza tra 3 e 20 caratteri e
                        può contenere solo lettere, numeri e trattini bassi
                    </p>

                    <label class="label">Ufficio</label>
                    <input v-model="office" type="email" class="input" placeholder="Ufficio" required />

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
                    <input v-model="passwordVerify" type="password" class="input" placeholder="Verifica password"
                        required />
                    <p v-if="password !== passwordVerify" class="text-error">
                        Le password non coincidono
                    </p>

                </fieldset>
            </div>
            <div class="modal-action">
                <form method="dialog" class="flex flex-row gap-2">
                    <button class="btn btn-neutral " @click="addAdmin" :disabled="!validateForm">Aggiungi</button>
                    <button class="btn btn-neutral" @click="closeModal('AmministratoreCrea')">Annulla</button>
                </form>
            </div>
        </div>
        <form method="dialog" class="modal-backdrop">
            <button @click="closeModal('AmministratoreCrea')">Annulla</button>
        </form>
    </dialog>
</template>

<script setup>

import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/authStores';
import RedirectMessage from '@/components/RedirectMessage.vue';
import service from '@/services/UserService';
import validator from '@/utils/Validator';
import { useRouter } from 'vue-router';

const store = useAuthStore();
const ready = ref(false);
const users = ref([]);
const userId = ref(null);
const username = ref('');
const name = ref('');
const surname = ref('');
const password = ref('');
const passwordVerify = ref('');
const office = ref('');
const errorMessage = ref(null);
const router = useRouter();

const validateUsername = computed(() => {
    return !username.value ? true : validator.validateUsername(username.value);
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
        name.value &&
        surname.value &&
        password.value &&
        passwordVerify.value &&
        validateUsername.value &&
        validateName.value &&
        validateSurname.value &&
        validatePassword.value &&
        validatePasswordVerify.value
    );
});

async function addAdmin() {
    try {
        errorMessage.value = null;
        const formData = {
            username: username.value,
            office: office.value,
            name: name.value,
            surname: surname.value,
            password: password.value,
            role: 'admin'
        };
        await store.registerAdmin(formData);
        closeModal('AmministratoreCrea');
        await getUsers();
    } catch (error) {
        errorMessage.value = store.error;
    }
};

async function getUsers() {
    users.value = [];
    try {
        users.value = await service.getUsers(store.token, 0, 0);
    } catch (error) {
        errorMessage.value = error.message || 'Errore durante il recupero degli utenti.';
    }
}

function openModal(id, uId) {
    userId.value = uId;
    document.getElementById(id).showModal();
}

function closeModal(id) {
    document.getElementById(id).close();
}

async function deleteUser() {
    try {
        await service.deleteUser(userId.value, store.token);
        if (userId === store.user.id) {
            store.logout();
            store.setMessage('Profilo eliminato con successo!');
            router.push({ path: '/' });
        }
        closeModal('UtentiElimina');
        userId.value = null;
        await getUsers();
    } catch (error) {
        errorMessage.value = error.message || 'Errore durante l\'eliminazione del profilo.';
    }
}

const goToUserInfo = (id) => {
    console.log(`Navigating to user info for ID: ${id}`);
	router.push({ path: `/users/${id}` });
};

onMounted(async () => {
    await getUsers();
    ready.value = true;
});

</script>