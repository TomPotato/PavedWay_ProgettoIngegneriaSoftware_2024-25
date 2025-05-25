<template>
    <div class="navbar px-4 text-font">
        <div class="flex-none">
            <RouterLink to="/" class="flex items-center text-xl font-bold">
                <img src="/logo.png" alt="Logo" class="h-20 mr-[-1em]" />
                <span>- PAVED WAY -</span>
            </RouterLink>
        </div>
        <div class="flex-1"></div>
        <div>
            <ul class="menu flex items-center menu-horizontal px-1">
                <li>
                    <RouterLink to="/">Home</RouterLink>
                </li>
                <li>
                    <RouterLink to="/events">Eventi</RouterLink>
                </li>
                <li>
                    <div class="dropdown dropdown-end">
                        <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
                            <div class="w-10 rounded-full">
                                <img alt="Tailwind CSS Navbar component"
                                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                            </div>
                        </div>
                        <ul tabindex="0"
                            class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                            <li v-if="!store.token">
                                <RouterLink to="/login">Accedi</RouterLink>
                            </li>
                            <li v-else>
                                <RouterLink to="/me">Profilo</RouterLink>
                            </li>
                            <li v-if="!store.token">
                                <RouterLink to="/register">Registrati</RouterLink>
                            </li>
                            <li v-else>
                                <span @click="openModal">Disconnettiti</span>
                            </li>
                        </ul>
                    </div>
                </li>
            </ul>
        </div>
    </div>

    <dialog id="logout" class="modal">
        <div class="modal-box max-w-md w-full">
            <h3 class="text-lg font-bold">Disconnessione</h3>
            <p class="py-2">Sei sicuro di volerti disconnettere?</p>
            <div class="modal-action">
                <form method="dialog" class="flex flex-row gap-2">
                    <button class="btn btn-primary" @click="logout">Disconnettiti</button>
                    <button class="btn btn-primary" @click="closeModal">Annulla</button>
                </form>
            </div>
        </div>
        <form method="dialog" class="modal-backdrop">
            <button @click="closeModal">Annulla</button>
        </form>
    </dialog>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/authStores';
import { nextTick } from 'vue';

const router = useRouter();
const route = useRoute();
const store = useAuthStore();

const openModal = () => {
    document.getElementById('logout').showModal();
    document.body.classList.add('modal-open');
};

const closeModal = () => {
    document.getElementById('logout').close();
    document.body.classList.remove('modal-open');
};

const logout = () => {
    store.logout();
    store.setMessage('Logout effettuato con successo!');
    router.replace({ path: '/refresh', query: { redirect: route.fullPath } });
    closeModal();
};

defineOptions({ name: 'Navbar' });
</script>