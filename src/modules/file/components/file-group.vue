<template>
  <div>
    <p class="text-xl uppercase font-bold mb-3">
      {{ $t(title) }}
    </p>
    <div class="flex gap-5">
      <div v-if="files.length > 0">
        <div v-for="file in files" :key="file.id">
          <File :file="file" />
        </div>
      </div>
      <div v-else class="text-xl text-gray-400">
        {{ $t('modules.file.components.group.hint') }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PropType, toRefs } from 'vue';
import { FileInterface } from '@shared';
import File from './file.vue';

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  files: {
    type: Object as PropType<FileInterface[]>,
    required: true,
  },
});

const { title, files } = toRefs(props);
</script>
