import { defineStore } from 'pinia';
import { Breadcrumb } from '@module/breadcrumbs/types';
import { Logger } from '@module/common/utils/logger';

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
