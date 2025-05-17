import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import routes from './routes';

const app = createApp(App);
app.use(createPinia());
app.use(routes);
app.mount('#app');