import { useBreadcrumbsStore } from '../store/breadcrumbsStore';
import { Breadcrumb } from '../types';

export default function useBreadcrumbs() {
  const { setBreadcrumbs: setStoreBreadcrumbs } = useBreadcrumbsStore();

  const setBreadcrumbs = (breadcrumbs: Breadcrumb[]) => {
    setStoreBreadcrumbs(breadcrumbs);
  };

  const clearBreadcrumbs = () => {
    setStoreBreadcrumbs([]);
  };

  return {
    setBreadcrumbs,
    clearBreadcrumbs,
  };
}
