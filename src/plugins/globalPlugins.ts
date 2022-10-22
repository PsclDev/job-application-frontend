import { App } from 'vue';
import NotificationsPlugin from '@/components/common/NotificationPlugin';

export default {
  install(Vue: App) {
    Vue.use(NotificationsPlugin);
  },
};
