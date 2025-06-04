<script setup>
import { useRoute, useRouter } from 'vue-router';
import { onMounted } from 'vue';

const route = useRoute();
const router = useRouter();

onMounted(() => {
    router.replace(route.query.redirect || '/');
});
</script>

<template>
    <div class="text-center py-8 text-xl font-semibold">
        Reindirizzamento in corso...
    </div>
</template>