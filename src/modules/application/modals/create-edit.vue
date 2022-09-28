<template>
  <BaseModal v-if="modelValue" :hide-actions="true" @hide="hideModal">
    <template #title>
      {{ mode === FormMode.CREATE ? $t('modules.application.modals.create.title') : $t('modules.application.modals.edit.title') }}
    </template>
    <template #body>
      <FormKit
        v-model="form"
        type="form"
        :submit-label="mode === FormMode.CREATE ? $t('common.create') : $t('common.update')"
        @submit="onSubmit"
      >
        <FormKit
          name="name"
          type="text"
          :label="$t('modules.application.form.name')"
          validation="required"
          minlength="3"
          maxlength="50"
          validation-visibility="dirty"
        />

        <FormKit
          name="description"
          type="text"
          :label="$t('modules.application.form.description')"
          maxlength="155"
          validation-visibility="dirty"
        />

        <FormKit
          name="company"
          type="text"
          validation="required"
          :label="$t('modules.application.form.company')"
          maxlength="155"
          validation-visibility="dirty"
        />

        <FormKit
          name="contact.name"
          type="text"
          :label="$t('modules.application.form.contact.name')"
          minlength="3"
          maxlength="50"
          validation-visibility="dirty"
        />

        <FormKit
          name="contact.position"
          type="text"
          :label="$t('modules.application.form.contact.position')"
          minlength="2"
          maxlength="50"
          validation-visibility="dirty"
        />

        <FormKit
          name="contact.email"
          type="email"
          validation="email"
          :label="$t('modules.application.form.contact.email')"
          minlength="3"
          maxlength="50"
          validation-visibility="dirty"
        />

        <FormKit
          name="jobUrl"
          type="url"
          validation="required|url"
          :label="$t('modules.application.form.joburl')"
          validation-visibility="dirty"
        />

        <FormKit
          name="status.state"
          type="select"
          validation="required"
          :options="stateOptions"
          :label="$t('modules.application.form.status')"
        />
      </FormKit>
    </template>
  </BaseModal>
</template>

<script lang="ts" setup>
import { StateEnum } from '@shared';
import { PropType, getCurrentInstance, ref, toRefs } from 'vue';
import { FormMode } from '../../common/types/form-mode';
import { useApplicationStore } from '../store/applicationStore';
import { CreateApplicationInterface } from '../types/create-application.interface';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  mode: {
    type: String as PropType<FormMode>,
    default: 'CREATE',
  },
  groupId: {
    type: String,
    default: '',
  },
  id: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:modelValue', 'edited']);
const { modelValue, mode, groupId, id } = toRefs(props);

const stateOptions = ref({} as any);
const app = getCurrentInstance();
const translation = app?.appContext.config.globalProperties.$t;
Object.keys(StateEnum).forEach((s: string) => {
  stateOptions.value[s] = translation(`enum.state.${s}`);
});

const initialState = ref<CreateApplicationInterface>({
  name: '',
  description: '',
  company: '',
  contact: {
    name: '',
    position: '',
    email: '',
  },
  jobUrl: '',
  status: {
    state: StateEnum.PENDING,
    date: new Date(),
  },
  notes: '',
});

const form = ref<CreateApplicationInterface>({
  ...initialState.value,
});

const { createApplication, applicationById, updateApplication } = useApplicationStore();

function hideModal() {
  form.value = initialState.value;
  emit('update:modelValue', !modelValue);
}

if (mode.value === FormMode.EDIT) {
  const application = applicationById(id.value)!;
  const { status, ...data } = application;

  // TODO get latest status
  initialState.value = {
    ...data,
    status: status[0],
  };
  form.value = {
    ...initialState.value,
  };
}

async function onSubmit() {
  if (mode.value === FormMode.CREATE) {
    await createApplication(groupId.value, form.value);
  }
  if (mode.value === FormMode.EDIT) {
    if (JSON.stringify(initialState) !== JSON.stringify(form)) {
      await updateApplication(id.value, form.value);
      emit('edited', form);
    }
  }
  hideModal();
}
</script>
