<template>
    <h1>Home</h1>
    <p>Clicca il bottone per andare al login.</p>
    <button @click="goToLogin">Vai al login</button>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goToLogin = () => {
    router.push({ name: 'login' });
};
</script>
