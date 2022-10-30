import { storeToRefs } from 'pinia';
import { Ref, ref } from 'vue';
import { Breadcrumb } from '@module/breadcrumbs/types';
import { useBreadcrumbsStore } from '@module/breadcrumbs/store/breadcrumbsStore';

export default function useBreadcrumbs() {
  const { setBreadcrumbs: setStoreBreadcrumbs } = useBreadcrumbsStore();

  const clearBreadcrumbs = () => {
    setStoreBreadcrumbs([]);
  };

  const getBreadcrumbs = (): Ref<Breadcrumb[]> => {
    const { getBreadcrumbs } = storeToRefs(useBreadcrumbsStore());
    return getBreadcrumbs;
  };

  const setBreadcrumbs = (breadcrumbs: Breadcrumb[]) => {
    setStoreBreadcrumbs(breadcrumbs);
  };

  const getApplicationId = (): Ref<string> => {
    return ref<string>(getBreadcrumbs().value[2]?.value ?? '');
  };

  const getGroupId = (): Ref<string> => {
    return ref<string>(getBreadcrumbs().value[1]?.value ?? '');
  };

  return {
    clearBreadcrumbs,
    getApplicationId,
    getBreadcrumbs,
    getGroupId,
    setBreadcrumbs,
  };
}
