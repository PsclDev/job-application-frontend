<template>
  <p class="text-center text-3xl font-extrabold text-gray-900">
    {{ $t('modules.group.pages.groups.title') }}
  </p>

  <div class="flex flex-col justify-center items-center mt-10">
    <button class="px-6 py-2 w-112 text-sm rounded shadow bg-emerald-100 hover:bg-emerald-300 text-emerald-500 hover:text-emerald-700" @click="showCreateModal = true">
      {{ $t('modules.group.pages.groups.create') }}
    </button>

    <div class="mt-16">
      <template v-if="loading">
        <LoadingIcon />
      </template>
      <template v-else>
        <div class="grid place-items-center">
          <div class="flex items-center">
            <input id="archived" v-model="showArchived" type="checkbox" class="w-4 h-4 accent-emerald-500 text-gray-200 focus:ring-emerald-500" @change="archivedChanged">
            <label for="archived" class="ml-2 text-sm font-medium text-gray-900">{{ $t('common.show-archived') }}</label>
          </div>
          <div class="flex flex-wrap justify-center gap-5 mt-5">
            <template v-if="groups.length > 0">
              <div v-for="group in groups" :key="group.id">
                <Group :group="group" />
              </div>
            </template>
            <template v-else>
              <p class="text-xl text-gray-400">
                {{ $t('modules.group.pages.groups.not-found') }}
              </p>
            </template>
          </div>
        </div>
      </template>
    </div>
  </div>

  <GDialog v-model="showCreateModal">
    <CreateGroup @submit="showCreateModal = false" />
  </GDialog>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import { useGroupStore } from '../store/group.store';
import Group from '../components/group.vue';
import CreateGroup from '../components/create-edit.vue';
import useBreadcrumbs from '@/modules/breadcrumbs/hooks/useBreadcrumbs';

const { clearBreadcrumbs } = useBreadcrumbs();
clearBreadcrumbs();

const { loading, groups: storeGroups } = storeToRefs(useGroupStore());

const showCreateModal = ref(false);
const showArchivedStorageKey = 'groups-show-archived';
const showArchived = ref(false);

function archivedChanged() {
  localStorage.setItem(showArchivedStorageKey, showArchived.value.toString());
}

if (localStorage.getItem(showArchivedStorageKey)) {
  showArchived.value = localStorage.getItem(showArchivedStorageKey) === 'true';
}

const groups = computed(() => {
  return showArchived.value ? storeGroups.value : storeGroups.value.filter(group => !group.isArchived);
});
</script>

<route lang="yaml">
name: groups
</route>
