<template>
  <button type="button" class="inline-flex relative items-center p-2 text-sm font-medium text-center text-white bg-emerald-200 rounded-lg hover:bg-emerald-500 focus:ring-4 focus:outline-none focus:ring-emerald-300" @click="showFileModal = true">
    <FileTextIcon size="1.5x" />
    <div v-if="filesLength > 0" class="inline-flex absolute -top-2 -right-2 justify-center items-center w-6 h-6 text-xs font-bold text-white bg-emerald-400 rounded-full border-2 border-white">
      {{ filesLength }}
    </div>
  </button>

  <GDialog v-model="showFileModal" content-class="g-dialog-fullscreen">
    <FileOverview />
  </GDialog>
</template>

<script lang="ts" setup>
import { FileTextIcon } from '@zhuowenli/vue-feather-icons';
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';
import FileOverview from './file-overview.vue';
import { useFileStore } from '@/modules/file/store/file.store';
import useBreadcrumbs from '@/modules/breadcrumbs/hooks/useBreadcrumbs';

const { getGlobalFiles, getGroupFiles, getApplicationFiles } = storeToRefs(useFileStore());
const { getApplicationId, getBreadcrumbs, getGroupId } = useBreadcrumbs();

const filesLength = ref<number>(0);

watch(() => getBreadcrumbs().value, () => {
  filesLength.value = [...getGlobalFiles.value, ...getGroupFiles.value(getGroupId().value), ...getApplicationFiles.value(getApplicationId().value)].length;
});

const showFileModal = ref(false);
</script>

<route lang="yaml">
name: file-header
</route>
