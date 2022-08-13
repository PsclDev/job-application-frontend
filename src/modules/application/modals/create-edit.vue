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
          :label="$t('modules.application.form.name')"
          validation="required"
          minlength="3"
          maxlength="50"
          validation-visibility="dirty"
        />

        <FormKit
          v-model="formValues.description"
          type="text"
          validation="required"
          :label="$t('modules.application.form.description')"
          maxlength="155"
          validation-visibility="dirty"
        />

        <FormKit
          v-model="formValues.company"
          type="text"
          validation="required"
          :label="$t('modules.application.form.company')"
          maxlength="155"
          validation-visibility="dirty"
        />

        <FormKit
          v-model="formValues.contact.name"
          name="contactName"
          type="text"
          help="If you set a contact, all contact fields are required"
          validation="contact"
          :label="$t('modules.application.form.contactname')"
          minlength="3"
          maxlength="50"
          validation-visibility="dirty"
        />

        <FormKit
          v-model="formValues.contact.position"
          name="contactPosition"
          type="text"
          validation="contact"
          :validation-label="$t('modules.application.form.contactposition')"
          :label="$t('modules.application.form.contactposition')"
          minlength="3"
          maxlength="50"
          validation-visibility="dirty"
        />

        <FormKit
          v-model="formValues.contact.email"
          name="contactEmail"
          type="email"
          validation="contact"
          :validation-label="$t('modules.application.form.contactposition')"
          :label="$t('modules.application.form.contactemail')"
          minlength="3"
          maxlength="50"
          validation-visibility="dirty"
        />

        <FormKit
          v-model="formValues.jobUrl"
          type="url"
          validation="required|url"
          :label="$t('modules.application.form.joburl')"
          validation-visibility="dirty"
        />

        <FormKit
          v-model="formValues.status"
          type="text"
          validation="required"
          :label="$t('modules.application.form.status')"
          maxlength="155"
          validation-visibility="dirty"
        />

        <FormKit
          v-model="formValues.notes"
          type="text"
          :label="$t('modules.application.form.notes')"
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

const formId = ref('create-edit-group');
const { modelValue, mode, groupId, id } = toRefs(props);

let initialState: CreateApplicationInterface = reactive({
  name: '',
  description: '',
  company: '',
  contact: {
    name: '',
    position: '',
    email: '',
  },
  jobUrl: '',
  status: '',
  notes: '',
});
let formValues: CreateApplicationInterface = reactive({
  name: '',
  description: '',
  company: '',
  contact: {
    name: '',
    position: '',
    email: '',
  },
  jobUrl: '',
  status: '',
  notes: '',
});

const { createApplication, applicationById, updateApplication } = useApplicationStore();

function hideModal() {
  formValues.name = initialState.name;
  emit('update:modelValue', !modelValue);
}

if (mode.value === FormMode.EDIT) {
  const application = applicationById(id.value)!;
  initialState = {
    name: application.name,
    description: application.description,
    company: application.company,
    contact: {
      name: application.contact?.name,
      position: application.contact?.position,
      email: application.contact?.email,
    },
    jobUrl: application.jobUrl,
    status: application.status,
    notes: application.notes,
  };
  formValues = {
    name: application.name,
    description: application.description,
    company: application.company,
    contact: {
      name: application.contact?.name,
      position: application.contact?.position,
      email: application.contact?.email,
    },
    jobUrl: application.jobUrl,
    status: application.status,
    notes: application.notes,
  };
}

function onSubmit() {
  if (mode.value === FormMode.CREATE) {
    createApplication(groupId.value, formValues);
  }
  if (mode.value === FormMode.EDIT) {
    if (JSON.stringify(initialState) !== JSON.stringify(formValues)) {
      updateApplication(id.value, formValues);
      emit('edited', formValues);
    }
  }
  hideModal();
}
</script>
