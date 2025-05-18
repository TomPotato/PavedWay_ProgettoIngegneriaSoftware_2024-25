import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import routes from './routes';

import './assets/styles/main.css';

const app = createApp(App);
app.use(createPinia());
app.use(routes);
app.mount('#app');