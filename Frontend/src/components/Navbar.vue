<template>
    <div class="navbar px-4 text-font">
        <div class="flex-none">
            <RouterLink to="/" class="flex items-center text-xl font-bold gap-2">
                <img src="/logo.png" alt="Logo" class="h-[10vh]" />
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
                <li v-if="store.isAdmin">
                    <RouterLink to="/users">Utenti</RouterLink>
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
                                <RouterLink to="/profile">Profilo</RouterLink>
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
                <li v-if="store.isCitizen">
                    <div class="dropdown dropdown-end" ref="notificationDropdown">
                        <div tabindex="0">
                            <div class="indicator">
                                <span v-if="notifications" class="indicator-item badge badge-secondary">{{
                                    notifications.length
                                }}</span>
                                <button class="btn btn-square btn-ghost drawer-button h-8 w-5">
                                    <img src="/bell.svg" />
                                </button>
                            </div>
                        </div>
                        <ul tabindex="0"
                            class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-auto p-2 shadow">
                            <li v-for="(notify, index) in notifications" :key="index">
                                <button class="block px-2 py-1"
                                    @click="notifications[index].siteId ? goToSiteInfo(notifications[index].siteId) : notifications[index].reportId ? goToReportInfo(notifications[index].reportId) : null"
                                    :disabled="!notify.reportId && !notify.siteId">
                                    <p>{{ notify.message }}</p>
                                    <p v-if="notify.reportId">{{ notify.reportId }}</p>
                                    <p v-if="notify.siteId">{{ notify.siteId }}</p>
                                </button>
                            </li>
                            <li>
                                <button class="btn btn-primary drawer-button h-auto"
                                    @click="openDrawer('Notifiche')">Centro Notifiche</button>
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
                    <button class="btn btn-neutral" @click="logout">Disconnettiti</button>
                    <button class="btn btn-neutral" @click="closeModal">Annulla</button>
                </form>
            </div>
        </div>
        <form method="dialog" class="modal-backdrop">
            <button @click="closeModal">Annulla</button>
        </form>
    </dialog>

    <div class="drawer drawer-end h-full center-0" style="z-index: 1050">
        <input id="Notifiche" type="checkbox" class="drawer-toggle" />
        <div class="drawer-side" style="z-index: 1060">
            <button @click="closeDrawer('Notifiche')" aria-label="close sidebar" class="drawer-overlay"></button>
            <div class="menu p-4 w-auto min-h-full bg-base-200 flex items-center justify-center">
                <div v-for="(notify, index) in notificationsDrawer" :key="index">
                    <button class="block px-2 py-1 btn btn-ghost h-auto text-black"
                        @click="notificationsDrawer[index].siteId ? goToSiteInfo(notificationsDrawer[index].siteId) : notificationsDrawer[index].reportId ? goToReportInfo(notificationsDrawer[index].reportId) : null"
                        :disabled="!notify.reportId && !notify.siteId">
                        <p>{{ notify.message }}</p>
                        <p v-if="notify.reportId">{{ notify.reportId }}</p>
                        <p v-if="notify.siteId">{{ notify.siteId }}</p>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/authStores';
import notificationService from '@/services/NotificationService';
import { onMounted, ref } from 'vue';

const router = useRouter();
const route = useRoute();
const store = useAuthStore();

const notifications = ref([]);
const notificationsDrawer = ref([]);


const openModal = () => {
    document.getElementById('logout').showModal();
    document.body.classList.add('modal-open');
};

const closeModal = () => {
    document.getElementById('logout').close();
    document.body.classList.remove('modal-open');
};

const openDrawer = (id) => {
    getNotifications();
    document.getElementById(id).checked = true;
};

const closeDrawer = (id) => {
    document.getElementById(id).checked = false;
};

const getNotifications = async (offset, limit) => {
    if (offset != undefined && limit != undefined) {
        notifications.value = await notificationService.getNotifications(offset, limit);
    } else {
        notificationsDrawer.value = await notificationService.getNotifications(0, 0);
    }
}

const logout = () => {
    store.logout();
    store.setMessage('Logout effettuato con successo!');
    router.replace({ path: '/refresh', query: { redirect: route.fullPath } });
    closeModal();
};

const goToReportInfo = (id) => {
    router.push({ path: `/reports/${id}` });
};

const goToSiteInfo = (id) => {
    router.push({ path: `/sites/${id}` });
};

onMounted(async () => {
    const allNotifications = await notificationService.getNotifications(0, 0);
    notifications.value = allNotifications.slice(-5).reverse();
});

defineOptions({ name: 'Navbar' });
</script>