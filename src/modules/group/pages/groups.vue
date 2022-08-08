<template>
  <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
    {{ $t('modules.group.pages.groups.overview') }}
  </h2>
  <div class="grid place-items-center mt-6">
    <div v-if="loading">
      <LoadingIcon />
    </div>
    <div v-else-if="error">
      <div class="text-red-600">
        {{ error }}
      </div>
    </div>
    <div v-else-if="getGroups">
      <div class="grid place-items-center">
        <div class="flex items-center mb-4">
          <input id="archived" v-model="showArchived" type="checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
          <label for="archived" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">{{ $t('common.showArchived') }}</label>
        </div>
        <button class="mb-5 rounded-lg px-4 py-2 bg-blue-700 text-green-100 hover:bg-blue-800 duration-300" @click="showCreateModal = true">
          {{ $t('modules.group.pages.groups.create') }}
        </button>
      </div>

      <div class="flex flex-row flex-wrap gap-4">
        <GroupCard v-for="group in groups" :key="group.id" :group="group" />
      </div>
    </div>
  </div>

  <Suspense>
    <CreateEditModal v-model="showCreateModal" />
  </Suspense>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import GroupCard from '../components/group-card.vue';
import { useGroupStore } from '../store/groupStore';
import CreateEditModal from '../modals/create-edit.vue';
import LoadingIcon from '@/components/common/buttons/LoadingIcon.vue';
import useBreadcrumbs from '@/modules/breadcrumbs/hooks/useBreadcrumbs';

const showArchived = ref(false);
const showCreateModal = ref(false);
const { getGroups, loading, error } = storeToRefs(useGroupStore());
const { loadGroups } = useGroupStore();
const { clearBreadcrumbs } = useBreadcrumbs();

clearBreadcrumbs();

const groups = computed(() => {
  return showArchived.value ? getGroups.value : getGroups.value.filter(group => !group.isArchived);
});

loadGroups();
</script>

<route lang="yaml">
name: Groups
</route>
