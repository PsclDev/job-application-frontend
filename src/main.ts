import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { defaultConfig as formKitConfig, plugin as formKitPlugin } from '@formkit/vue';
import { QuillEditor } from '@vueup/vue-quill';
import { GDialog } from 'gitart-vue-dialog';
import SetupCalendar from 'v-calendar';
import App from './App.vue';
import router from './router/router';
import i18n from '@/i18n';
import globalPlugins from '@/plugins/globalPlugins';

import '@formkit/themes/genesis';
import 'gitart-vue-dialog/dist/style.css';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import 'v-calendar/dist/style.css';
import '@/assets/css/index.scss';
import './modules/common/apiConfig';

createApp(App)
  .use(createPinia())
  .use(i18n)
  .use(router)
  .use(globalPlugins)
  .use(formKitPlugin, formKitConfig)
  .component('QuillEditor', QuillEditor)
  .component('GDialog', GDialog)
  .use(SetupCalendar, {})
  .mount('#app');
