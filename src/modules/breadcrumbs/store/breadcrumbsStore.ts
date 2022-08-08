import { defineStore } from 'pinia';
import { Breadcrumb } from '../types';
import { Logger } from '@/modules/common/utils/logger';

export const useBreadcrumbsStore = defineStore('breadcrumbs', {
  state: () => {
    return {
      logger: new Logger('BreadcrumbsStore'),
      breadcrumbs: [] as Breadcrumb[],
    };
  },
  actions: {
    async setBreadcrumbs(data: Breadcrumb[]) {
      this.logger.info('setBreadcrumbs', data);
      this.breadcrumbs = data;
    },
  },
  getters: {
    getBreadcrumbs: state => state.breadcrumbs,
  },
});
