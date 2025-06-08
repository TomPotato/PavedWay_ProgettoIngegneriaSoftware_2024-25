<template>
    <div v-if="ready" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div v-for="user in users" :key="user.id" class="card bg-base-100 shadow-xl">
            <div class="card-body">
                <h2 class="card-title">{{ user.name }} {{ user.surname }}{{ user.id === store.user.id ? ' (tu)' : '' }}
                </h2>
                <p>{{ user.email || user.office }}</p>
                <div class="card-actions justify-end">
                    <button class="btn btn-primary">Info</button>
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
</template>

<script setup>

import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStores';
import RedirectMessage from '@/components/RedirectMessage.vue';
import service from '@/services/UserService';

const store = useAuthStore();

const ready = ref(false);
const errorMessage = ref(null);

const users = ref([]);
const userId = ref(null);

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
    document.getElementById('UtentiElimina').showModal();
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

onMounted(async () => {
    await getUsers();
    ready.value = true;
});

</script>