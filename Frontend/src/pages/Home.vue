<template>
    <h1>Home</h1>
    <p>Clicca il bottone per andare al login.</p>
    <button @click="goToLogin">Vai al login</button>
    <RedirectMessage />
</template>

<script setup>
import RedirectMessage from '@/components/RedirectMessage.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const goToLogin = () => {
    router.push({ name: 'login' });
};
</script>
