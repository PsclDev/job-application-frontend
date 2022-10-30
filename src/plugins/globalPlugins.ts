import { App } from 'vue';
import NotificationsPlugin from '@global/NotificationPlugin';

export default {
  install(Vue: App) {
    Vue.use(NotificationsPlugin);
  },
};
