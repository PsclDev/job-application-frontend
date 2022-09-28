<template>
  <BaseModal v-if="modelValue" :hide-actions="true" @hide="hideModal">
    <template #title>
      {{ mode === FormMode.CREATE ? $t('modules.meeting.modals.create.title') : $t('modules.meeting.modals.edit.title') }}
    </template>
    <template #body>
      <FormKit
        v-model="form"
        type="form"
        @submit="onSubmit"
      >
        <FormKit
          name="title"
          type="text"
          label="Titel"
          validation="required"
          minlength="3"
          maxlength="50"
          validation-visibility="dirty"
        />

        <FormKit
          name="date"
          type="datetime-local"
          label="Datetime"
          validation="required"
          validation-visibility="dirty"
        />

        <FormKit
          name="link"
          type="text"
          label="Link"
          validation="url"
          validation-visibility="dirty"
        />

        <FormKit
          name="attendees"
          type="list"
        >
          <p>Please provide a list of attendees.</p>
          <FormKit
            v-for="index in attendeesCount" :key="index"
            type="group"
          >
            <FormKit
              type="text"
              label="Name"
              placeholder="Name"
              name="name"
              validation="required"
              validation-visibility="dirty"
            />
            <FormKit
              type="text"
              label="Position"
              placeholder="HR"
              name="position"
            />
            <FormKit
              type="text"
              label="Email"
              placeholder="Email"
              name="email"
              validation="email"
            />
          </FormKit>
          <button class="mb-5 rounded-lg px-4 py-2 bg-blue-700 text-green-100 hover:bg-blue-800 duration-300" @click="attendeesCount++">
            Add attendee
          </button>
          <button class="mb-5 rounded-lg px-4 py-2 bg-blue-700 text-green-100 hover:bg-blue-800 duration-300" @click="attendeesCount--">
            Remove attendee
          </button>
        </FormKit>
      </FormKit>
    </template>
  </BaseModal>
</template>

<script lang="ts" setup>
import { DateTime } from 'luxon';
import { PropType, ref, toRefs } from 'vue';
import { FormMode } from '../../common/types/form-mode';
import { useMeetingStore } from '../store/meetingStore';
import { CreateMeetingInterface } from '../types/create-meeting.interface';
import { pickerDateTimeFormat } from '../util/date-time-format';

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
  applicationId: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:modelValue', 'edited']);
const { modelValue, mode, id, applicationId } = toRefs(props);

const attendeesCount = ref(1);
const initialState = ref<CreateMeetingInterface>({
  title: '',
  date: DateTime.now().toFormat(pickerDateTimeFormat),
  attendees: [],
  link: '',
});

const form = ref<CreateMeetingInterface>({
  ...initialState.value,
});

const { createMeeting, updateMeeting } = useMeetingStore();

function hideModal() {
  form.value = initialState.value;
  attendeesCount.value = 1;
  emit('update:modelValue', !modelValue);
}

// if (mode.value === FormMode.EDIT) {
//   const group = groupById(id.value);

//   initialState.value = { ...(group as CreateGroupInterface) };
//   form.value = { ...(group as CreateGroupInterface) };
// }

async function onSubmit() {
  if (mode.value === FormMode.CREATE) {
    await createMeeting(applicationId.value, form.value);
  }
  if (mode.value === FormMode.EDIT) {
    if (JSON.stringify(initialState.value) !== JSON.stringify(form.value)) {
      await updateMeeting(applicationId.value, id.value, form.value);
      emit('edited', form);
    }
  }
  hideModal();
}
</script>
