<template>
  <div class="p-5 h-full rounded-lg border-2 border-gray-100 drop-shadow-xl">
    <div class="flex flex-col gap-5 items-start">
      <div v-if="globalFiles.length > 0">
        <FileGroup title="modules.file.modal.group.global" :files="globalFiles" />
      </div>

      <div v-if="groupFiles.length > 0">
        <FileGroup title="modules.file.modal.group.group" :files="groupFiles" />
      </div>

      <div v-if="applicationFiles.length > 0">
        <FileGroup title="modules.file.modal.group.application" :files="applicationFiles" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';
import { FileInterface } from '@shared';
import FileGroup from './file-group.vue';
import { useFileStore } from '@/modules/file/store/file.store';
import useBreadcrumbs from '@/modules/breadcrumbs/hooks/useBreadcrumbs';

const { files, getGlobalFiles, getGroupFiles, getApplicationFiles } = storeToRefs(useFileStore());
const { getApplicationId, getBreadcrumbs, getGroupId } = useBreadcrumbs();

const globalFiles = ref<FileInterface[]>([]);
const groupFiles = ref<FileInterface[]>([]);
const applicationFiles = ref<FileInterface[]>([]);

watch(() => getBreadcrumbs().value, () => {
  sortFiles();
});

watch(() => files.value, () => {
  sortFiles();
});

function sortFiles() {
  globalFiles.value = getGlobalFiles.value;
  groupFiles.value = getGroupFiles.value(getGroupId().value);
  applicationFiles.value = getApplicationFiles.value(getApplicationId().value);
}

sortFiles();
</script>

<route lang="yaml">
name: file-overview
</route>
