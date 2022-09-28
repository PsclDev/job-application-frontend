<template>
  <BaseModal v-if="modelValue" :hide-actions="true" @hide="hideModal">
    <template #title>
      {{ $t('modules.application.modals.move.title') }}
    </template>
    <template #body>
      <template v-if="!disableForm">
        <FormKit
          v-model="form"
          :disabled="disableForm"
          type="form"
          :submit-label="$t('modules.application.modals.move.submit')"
          @submit="onSubmit"
        >
          <FormKit
            name="group"
            type="select"
            :options="groupOptions"
            :placeholder="$t('modules.application.modals.move.description')"
          />
        </FormKit>
      </template>
      <template v-else>
        Cant move this application, because no other groups exists
      </template>
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
const form = ref({
  group: '',
});

const groupOptions = ref<any>({});
const disableForm = ref(false);

getGroups.value.filter(g => g.id !== currentGroupId.value).forEach((group) => {
  groupOptions.value[group.id] = group.name;
});

if (Object.keys(groupOptions.value).length === 0) {
  disableForm.value = true;
}

function hideModal() {
  emit('update:modelValue', !modelValue);
}

function onSubmit() {
  moveApplication(id.value, form.value.group!);
  hideModal();
}
</script>
