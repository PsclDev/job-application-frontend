<template>
  <BaseModal v-if="modelValue" :hide-actions="true" @hide="hideModal">
    <template #title>
      {{ mode === FormMode.CREATE ? $t('modules.meeting.modals.create.title') : $t('modules.meeting.modals.edit.title') }}
    </template>
    <template #body>
      <BaseForm
        :id="formId"
        :submit-label="mode === FormMode.CREATE ? $t('common.create') : $t('common.update')"
        @submit="onSubmit"
      >
        <FormKit
          v-model="formValues.title"
          type="text"
          :label="$t('modules.meeting.form.title')"
          validation="required"
          minlength="3"
          maxlength="50"
          validation-visibility="dirty"
        />

        <FormKit
          v-model="formValues.date"
          type="datetime-local"
          validation="required"
          :label="$t('modules.meeting.form.date')"
          maxlength="155"
          validation-visibility="dirty"
        />

        <p>{{ $t('modules.meeting.form.attendees') }}</p>
      </BaseForm>
    </template>
  </BaseModal>
</template>

<script lang="ts" setup>
import { PropType, reactive, ref, toRefs } from 'vue';
import { FormMode } from '../../common/types/form-mode';
import { CreateMeetingInterface } from '../types/create-meeting.interface';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  mode: {
    type: String as PropType<FormMode>,
    default: 'CREATE',
  },
  applicationId: {
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
const { modelValue, mode, applicationId, id } = toRefs(props);

const initialState: CreateMeetingInterface = reactive({
  title: '',
  date: new Date(),
  attendees: [],
  notes: '',
});
const formValues: CreateMeetingInterface = reactive({
  title: '',
  date: new Date(),
  attendees: [],
  notes: '',
});

// const { createApplication, applicationById, updateApplication } = useApplicationStore();

function hideModal() {
  emit('update:modelValue', !modelValue);
}

// if (mode.value === FormMode.EDIT) {
//   const application = applicationById(id.value)!;
//   initialState = {
//     name: application.name,
//     description: application.description,
//     company: application.company,
//     contact: {
//       name: application.contact?.name,
//       position: application.contact?.position,
//       email: application.contact?.email,
//     },
//     jobUrl: application.jobUrl,
//     status: application.status,
//     notes: application.notes,
//   };
//   formValues = {
//     name: application.name,
//     description: application.description,
//     company: application.company,
//     contact: {
//       name: application.contact?.name,
//       position: application.contact?.position,
//       email: application.contact?.email,
//     },
//     jobUrl: application.jobUrl,
//     status: application.status,
//     notes: application.notes,
//   };
// }

function onSubmit() {
  // if (mode.value === FormMode.CREATE) {
  //   createApplication(groupId.value, formValues);
  // }
  // if (mode.value === FormMode.EDIT) {
  //   if (JSON.stringify(initialState) !== JSON.stringify(formValues)) {
  //     updateApplication(id.value, formValues);
  //     emit('edited', formValues);
  //   }
  // }
  hideModal();
}
</script>
