<template>
  <BaseModal v-if="modelValue" :hide-actions="true" @hide="hideModal">
    <template #title>
      {{ $t('modules.application.modals.move.title') }}
    </template>
    <template #body>
      {{ $t('modules.application.modals.move.description') }}
      <BaseForm
        class="mt-5"
        :submit-label="$t('modules.application.modals.move.submit')"
        @submit="onSubmit"
      >
        <FormKit
          v-model="selectedGroupId"
          type="select"
          :options="groupOptions"
        />
      </BaseForm>
    </template>
  </BaseModal>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { ref, toRefs } from 'vue';
import { useApplicationStore } from '../store/applicationStore';
import { useGroupStore } from '@/modules/group/store/groupStore';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  id: {
    type: String,
    default: '',
  },
  currentGroupId: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:modelValue', 'edited']);
const { modelValue, id, currentGroupId } = toRefs(props);
const { moveApplication } = useApplicationStore();
const { getGroups } = storeToRefs(useGroupStore());
const selectedGroupId = ref('');
const groupOptions = ref<any>({});

getGroups.value.filter(g => g.id !== currentGroupId.value).forEach((group) => {
  groupOptions.value[group.id] = group.name;
});

function hideModal() {
  emit('update:modelValue', !modelValue);
}

function onSubmit() {
  moveApplication(id.value, selectedGroupId.value);
  hideModal();
}
</script>
