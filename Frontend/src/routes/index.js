import { createRouter, createWebHistory } from 'vue-router';

import { useAuthStore } from '../stores/authStores';

import Home from '../pages/Home.vue';
import Login from '../pages/Login.vue';
import Register from '../pages/Register.vue';
import Events from '../pages/Events.vue';
import Refresh from '../pages/Refresh.vue';

const routes = [
    { path: '/', name: 'home', component: Home },
    { path: '/login', name: 'login', component: Login },
    { path: '/register', name: 'register', component: Register },
    { path: '/events', name: 'events', component: Events },
    { path: '/refresh', name: 'refresh', component: Refresh },
    { path: '/:pathMatch(.*)*', redirect: '/' },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const authPages = ['/login', '/register'];

    const fromAuth = authPages.includes(from.path);
    const toAuth = authPages.includes(to.path);

    if (toAuth && !fromAuth) {
        const store = useAuthStore();
        store.setRedirect(from.path);
    }

    next();
});

export default router;