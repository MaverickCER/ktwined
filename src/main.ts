import './assets/main.css'

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { VueFire, VueFireAuth } from 'vuefire';
import App from './App.vue';
// the file we created above with `database`, `firestore` and other exports
import { firebaseApp } from './services/firebase';
import router from './router';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app
  .use(VueFire, {
    // imported above but could also just be created here
    firebaseApp,
    modules: [
      // we will see other modules later on
      VueFireAuth(),
    ],
  });

app.mount('#app');
