<template>
  <BaseModal v-if="modelValue" :hide-actions="true" @hide="hideModal">
    <template #title>
      {{ mode === FormMode.CREATE ? $t('modules.group.modals.create.title') : $t('modules.group.modals.edit.title') }}
    </template>
    <template #body>
      <BaseForm
        :id="formId"
        :submit-label="mode === FormMode.CREATE ? $t('common.create') : $t('common.update')"
        @submit="onSubmit"
      >
        <FormKit
          v-model="formValues.name"
          type="text"
          :label="$t('modules.group.form.name')"
          validation="required"
          minlength="3"
          maxlength="50"
          validation-visibility="dirty"
        />

        <FormKit
          v-model="formValues.description"
          type="text"
          :label="$t('modules.group.form.description')"
          maxlength="155"
          validation-visibility="dirty"
        />
      </BaseForm>
    </template>
  </BaseModal>
</template>

<script lang="ts" setup>
import { PropType, reactive, ref, toRefs } from 'vue';
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

const formId = ref('create-edit-group');
const { modelValue, mode, id } = toRefs(props);

const initialState: CreateGroupInterface = reactive({
  name: '',
  description: '',
});

const formValues: CreateGroupInterface = reactive({
  ...initialState,
});

const { createGroup, groupById, updateGroup } = useGroupStore();

function hideModal() {
  formValues.name = initialState.name;
  emit('update:modelValue', !modelValue);
}

if (mode.value === FormMode.EDIT) {
  const group = groupById(id.value);
  initialState.name = group!.name;
  initialState.description = group!.description;
  formValues.name = group!.name;
  formValues.description = group!.description;
}

function onSubmit() {
  if (mode.value === FormMode.CREATE) {
    createGroup(formValues);
  }
  if (mode.value === FormMode.EDIT) {
    if (JSON.stringify(initialState) !== JSON.stringify(formValues)) {
      updateGroup(id.value, formValues);
      emit('edited', formValues);
    }
  }
  hideModal();
}
</script>
