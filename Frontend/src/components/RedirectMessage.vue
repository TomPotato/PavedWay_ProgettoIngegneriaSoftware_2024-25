<template>
    <div v-if="successMessage" class="toast toast-end">
        <div class="alert alert-success">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ successMessage }}</span>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/authStores';
import { onMounted } from 'vue';

const successMessage = ref(null);
const store = useAuthStore();

onMounted(() => {
    if (store.message) {
        successMessage.value = store.message;
        store.clearMessage();
        setTimeout(() => {
            successMessage.value = null;
        }, 3000);
    }
});

defineOptions({ name: 'RedirectMessage' });

</script>