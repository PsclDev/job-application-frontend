import { createRouter, createWebHistory } from 'vue-router';
import { setupLayouts } from 'virtual:generated-layouts';
import generatedRoutes from 'virtual:generated-pages';
import { Logger } from '@module/common/utils/logger';

const logger = new Logger('Router');
const routes = setupLayouts(generatedRoutes);
logger.info('Routes: ', routes);

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: (to) => {
    if (to) {
      return { selector: to.hash };
    }

    return { left: 0, top: 0 };
  },
});

export default router;
