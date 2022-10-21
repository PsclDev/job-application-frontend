<template>
  <div>
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
          <template v-if="applications.length > 0">
            <div v-for="application in applications" :key="application.id">
              <Application :application="application" />
            </div>
          </template>
          <template v-else>
            <p class="text-xl text-gray-400">
              {{ $t('modules.application.components.applications.not-found') }}
            </p>
          </template>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { computed, ref, toRefs } from 'vue';
import Application from '../components/application.vue';
import { useApplicationStore } from '../store/application.store';

const props = defineProps({
  groupId: {
    type: String,
    required: true,
  },
});
const { groupId } = toRefs(props);

const { loading, applicationsByGroupId } = storeToRefs(useApplicationStore());

const showArchivedStorageKey = 'applications-show-archived';
const showArchived = ref(false);

function archivedChanged() {
  localStorage.setItem(showArchivedStorageKey, showArchived.value.toString());
}

if (localStorage.getItem(showArchivedStorageKey)) {
  showArchived.value = localStorage.getItem(showArchivedStorageKey) === 'true';
}

const applications = computed(() => {
  return showArchived.value ? applicationsByGroupId.value(groupId.value) : applicationsByGroupId.value(groupId.value).filter(application => !application.isArchived);
});
</script>

<route lang="yaml">
name: groups
</route>
