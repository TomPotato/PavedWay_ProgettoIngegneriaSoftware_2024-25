import { createRouter, createWebHistory } from 'vue-router';

import { useAuthStore } from '../stores/authStores';

import Home from '../pages/Home.vue';
import Login from '../pages/Login.vue';
import Register from '../pages/Register.vue';
import Events from '../pages/Events.vue';
import Profile from '../pages/Profile.vue';
import ReportInfo from '../pages/ReportInfo.vue';

const routes = [
    { path: '/', name: 'home', component: Home },
    { path: '/login', name: 'login', component: Login },
    { path: '/register', name: 'register', component: Register },
    { path: '/events', name: 'events', component: Events },
    { path: '/profile', name: 'profile', component: Profile, meta: { requiresAuth: true}},
    { path: '/report/(.*)*', name: 'reportInfo', component: ReportInfo },
    { path: '/:pathMatch(.*)*', redirect: '/' }, // Redirect to home for any unmatched routes
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const authPages = ['/login', '/register'];
    const store = useAuthStore();

    const fromAuth = authPages.includes(from.path);
    const toAuth = authPages.includes(to.path);

    if (to.meta.requiresAuth && !store.isAuthenticated) {
        store.setRedirect(from.path);
        return next({ name: 'login' });
    } else if (to.meta.requiresAdmin && (!store.isAuthenticated || !store.isAdmin)) {
        store.setRedirect(from.path);
        return next({ name: 'home' });
    }

    if (toAuth && !fromAuth) {
        store.setRedirect(from.path);
    }

    next();
});

export default router;