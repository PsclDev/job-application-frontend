<template>
  <BaseModal v-if="modelValue" @hide="hideModal">
    <template #title>
      {{ $t(title) }}
    </template>
    <template #body>
      {{ $t(description) }}
    </template>
    <template #actions>
      <div class="flex gap-4">
        <button class="rounded-lg px-4 py-2 bg-red-600 text-red-100 hover:bg-red-700 duration-300" @click="deleted">
          {{ $t('common.delete') }}
        </button>
        <button class="rounded-lg px-4 py-2 bg-gray-200 hover:bg-gray-300 duration-300" @click="canceled">
          {{ $t('common.cancel') }}
        </button>
      </div>
    </template>
  </BaseModal>
</template>

<script lang="ts" setup>
import { toRefs } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue', 'deleted', 'canceled']);
const { modelValue } = toRefs(props);

function hideModal() {
  emit('update:modelValue', !modelValue);
}

function deleted() {
  hideModal();
  emit('deleted');
}

function canceled() {
  hideModal();
  emit('canceled');
}
</script>
