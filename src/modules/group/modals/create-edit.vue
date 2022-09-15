<template>
  <BaseModal v-if="modelValue" :hide-actions="true" @hide="hideModal">
    <template #title>
      {{ mode === FormMode.CREATE ? $t('modules.group.modals.create.title') : $t('modules.group.modals.edit.title') }}
    </template>
    <template #body>
      <FormKit
        v-model="form"
        type="form"
        @submit="onSubmit"
      >
        <FormKit
          name="name"
          type="text"
          :label="$t('modules.group.form.name')"
          validation="required"
          minlength="3"
          maxlength="50"
          validation-visibility="dirty"
        />

        <FormKit
          name="description"
          type="text"
          :label="$t('modules.group.form.description')"
          maxlength="155"
          validation-visibility="dirty"
        />
      </FormKit>
    </template>
  </BaseModal>
</template>

<script lang="ts" setup>
import { PropType, ref, toRefs } from 'vue';
import { FormMode } from '../../common/types/form-mode';
import { useGroupStore } from '../store/groupStore';
import { CreateGroupInterface } from '../types/create-group.interface';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  mode: {
    type: String as PropType<FormMode>,
    default: 'CREATE',
  },
  id: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:modelValue', 'edited']);
const { modelValue, mode, id } = toRefs(props);

const initialState = ref<CreateGroupInterface>({
  name: '',
  description: '',
});

const form = ref<CreateGroupInterface>({
  ...initialState.value,
});

const { createGroup, groupById, updateGroup } = useGroupStore();

function hideModal() {
  form.value = initialState.value;
  emit('update:modelValue', !modelValue);
}

if (mode.value === FormMode.EDIT) {
  const group = groupById(id.value);

  initialState.value = { ...(group as CreateGroupInterface) };
  form.value = { ...(group as CreateGroupInterface) };
}

function onSubmit() {
  if (mode.value === FormMode.CREATE) {
    createGroup(form.value);
  }
  if (mode.value === FormMode.EDIT) {
    if (JSON.stringify(initialState.value) !== JSON.stringify(form.value)) {
      updateGroup(id.value, form.value);
      emit('edited', form);
    }
  }
  hideModal();
}
</script>
