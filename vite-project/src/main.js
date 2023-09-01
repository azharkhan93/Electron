
import { createApp } from 'vue';
import router from './router/index.js';
import 'bootstrap/dist/css/bootstrap.css';
import App from './App.vue';

const app = createApp(App);

// Use the Vue Router plugin
app.use(router);

// Mount the app to the DOM
app.mount('#app');

