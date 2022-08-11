<template>
  <div id="modal" class="fixed z-10 overflow-y-auto top-0 w-full left-0">
    <div class="flex items-center justify-center min-height-100vh pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 transition-opacity">
        <div class="absolute inset-0 bg-gray-900 opacity-75" @click="hideModal" />
      </div>
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
      <div class="inline-block align-center bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
        <div class="flex items-center justify-between justify-between bg-gray-200 px-4 py-3">
          <slot name="title" />

          <div class="p-1 cursor-pointer" @click="hideModal">
            <XIcon size="1.5x" class="ml-2 -mr-1 w-4 h-4" />
          </div>
        </div>

        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <slot name="body" />
        </div>

        <div class="grid place-items-end bg-gray-200 px-4 py-3" :class="hideActions ? 'hidden' : ''">
          <slot name="actions" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { XIcon } from '@zhuowenli/vue-feather-icons';

defineProps({
  hideActions: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['hide']);

function hideModal() {
  emit('hide');
}
</script>
