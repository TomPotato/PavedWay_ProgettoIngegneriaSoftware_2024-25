<template>
    <div v-if="ready" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div v-for="user in users" :key="user.id" class="card bg-base-100 shadow-xl">
            <div class="card-body">
                <h2 class="card-title">{{ user.name }} {{ user.surname }}</h2>
                <p>{{ user.email || user.office }}</p>
                <div class="card-actions justify-end">
                    <button class="btn btn-primary">Info</button>
                </div>
            </div>
        </div>
    </div>
    <RedirectMessage />
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

const getUsers = async () => {
    try {
        users.value = await service.getUsers(store.token, 0, 0);
    } catch (error) {
        errorMessage.value = error.message;
    }
};

onMounted(async () => {
    await getUsers();
    ready.value = true;
});

</script>