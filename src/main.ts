import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { plugin as formKitPlugin } from '@formkit/vue';
import { QuillEditor } from '@vueup/vue-quill';
import SetupCalendar from 'v-calendar';
import App from './App.vue';
import router from './router/router';
import i18n from '@/i18n';
import globalPlugins from '@/plugins/globalPlugins';

import '@formkit/themes/genesis';
import '@/assets/css/index.scss';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import 'v-calendar/dist/style.css';
import './modules/common/apiConfig';

createApp(App)
  .use(createPinia())
  .use(i18n)
  .use(router)
  .use(globalPlugins)
  .use(formKitPlugin)
  .component('QuillEditor', QuillEditor)
  .use(SetupCalendar, {})
  .mount('#app');
