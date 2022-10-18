<template>
  <div>
    <p class="text-xl uppercase font-bold mb-3">
      {{ $t(title) }}
    </p>
    <div class="flex gap-5">
      <div v-for="file in files" :key="file.id">
        <File :file="file" />
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

<route lang="yaml">
name: file-group
</route>
