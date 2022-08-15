import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { defaultConfig, plugin as formKitPlugin } from '@formkit/vue';
import { QuillEditor } from '@vueup/vue-quill';
import App from './App.vue';
import router from './router/router';
import contact from './modules/application/rules/contact-rule';
import i18n from '@/i18n';
import globalPlugins from '@/plugins/globalPlugins';

import '@formkit/themes/genesis';
import '@/assets/css/index.scss';
import '@vueup/vue-quill/dist/vue-quill.snow.css';

import './modules/common/apiConfig';
createApp(App)
  .use(createPinia())
  .use(i18n)
  .use(router)
  .use(globalPlugins)
  .use(formKitPlugin, defaultConfig({
    rules: { contact },
  }))
  .component('QuillEditor', QuillEditor)
  .mount('#app');
