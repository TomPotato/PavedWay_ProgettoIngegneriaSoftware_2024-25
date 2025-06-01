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
                    <RouterLink to="/profile">Profilo</RouterLink>
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
                                <RouterLink to="/logout">Disconnettiti</RouterLink>
                            </li>
                        </ul>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStores';

const store = useAuthStore();

defineOptions({ name: 'Navbar' });
</script>