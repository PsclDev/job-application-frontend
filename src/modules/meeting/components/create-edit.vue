<template>
  <div class="p-5 flex flex-col justify-center">
    <p class="text-2xl text-bold text-center mb-8">
      {{ $t(mode === 'CREATE' ? 'modules.meeting.modal.form.create' : 'modules.meeting.modal.form.edit') }}
    </p>

    <FormKit
      id="create-edit-meeting"
      v-model="form"
      type="form"
      :submit-label="$t(mode === 'CREATE' ? 'common.create' : 'common.update')"
      @submit="onSubmit"
    >
      <FormKit
        name="title"
        type="text"
        :label="$t('modules.meeting.modal.form.title')"
        minlength="3"
        maxlength="50"
        validation-visibility="dirty"
        validation="required"
      />

      <FormKit
        type="datetime-local"
        name="date"
        :label="$t('modules.meeting.modal.form.date')"
        validation="required"
      />

      <FormKit
        name="link"
        type="url"
        :label="$t('modules.meeting.modal.form.link')"
        maxlength="155"
        validation-visibility="live"
        validation="url"
      />

      <FormKit
        v-for="(attendee) in tempAttendees"
        :key="attendee.localId"
        :name="`contact${attendee.localId}`"
        type="group"
      >
        <p>{{ `#${attendee.localId + 1} ${$t('modules.meeting.modal.form.attendee')}` }}</p>
        <div class="flex justify-between">
          <FormKit
            type="text"
            name="name"
            :label="$t('modules.meeting.modal.form.attendee-name')"
            minlength="3"
            maxlength="50"
            validation-visibility="dirty"
          />
          <FormKit
            type="text"
            name="position"
            :label="$t('modules.meeting.modal.form.attendee-position')"
            minlength="2"
            maxlength="50"
            validation-visibility="dirty"
          />
          <FormKit
            type="email"
            name="email"
            :label="$t('modules.meeting.modal.form.attendee-email')"
            validation-visibility="live"
            validation="email"
          />
          <button type="button" class="text-red-500 pt-2" @click="removeAttendee(attendee.localId)">
            <Trash2Icon size="1.5x" />
          </button>
        </div>
      </FormKit>

      <button type="button" class="px-6 py-2 mb-5 w-full text-sm rounded bg-gray-100 hover:bg-gray-300 text-gray-500 hover:text-gray-700 opacity-75 hover:opacity-100" @click="addAttendee">
        {{ $t('modules.meeting.modal.form.add-attendee') }}
      </button>
    </FormKit>
  </div>
</template>

<script lang="ts" setup>
import { PropType, getCurrentInstance, ref, toRefs } from 'vue';
import { MeetingInterface, StateEnum } from '@shared';
import { DateTime } from 'luxon';
import { Trash2Icon } from '@zhuowenli/vue-feather-icons';
import { reset } from '@formkit/core';
import { CreateMeetingInterface } from '../types/meeting.interface';
import { useMeetingStore } from '../store/meeting.store';
import { FormMode } from '@/modules/common/types';
import { CreatePersonInterface } from '@/modules/application/types/person.interface';
import { getFormDateTimeFormat } from '@/modules/common/utils';

const props = defineProps({
  mode: {
    type: String as PropType<FormMode>,
    default: 'CREATE',
  },
  applicationId: {
    type: String,
  },
  meeting: {
    type: Object as PropType<MeetingInterface>,
  },
});

const emit = defineEmits(['submit']);

const { mode, applicationId, meeting } = toRefs(props);

const stateOptions = ref({} as any);
const app = getCurrentInstance();
const translation = app?.appContext.config.globalProperties.$t;
Object.keys(StateEnum).forEach((s: string) => {
  stateOptions.value[s] = translation(`enum.state.${s}`);
});

const initialState = ref<CreateMeetingInterface>({
  title: '',
  link: '',
  attendees: [],
  date: DateTime.now().toFormat(getFormDateTimeFormat()),
});
const tempAttendees = ref<CreatePersonInterface[]>([]);
let attendeeAmount = 0;

const form = ref<CreateMeetingInterface>(
  {
    ...(mode.value === FormMode.EDIT ? meetingAsForm(meeting!.value!) : initialState.value),
  },
);

function meetingAsForm(meeting: MeetingInterface): CreateMeetingInterface {
  const { attendees, date, link, title } = meeting;
  const formObj: any = {
    attendees: [] as CreatePersonInterface[],
    date: DateTime.fromJSDate(new Date(date)).toFormat(getFormDateTimeFormat()),
    link,
    title,
  };

  attendees.forEach((attendee, idx) => {
    tempAttendees.value.push({ localId: attendeeAmount, name: attendee.name, position: attendee.position, email: attendee.email });
    formObj[`contact${idx}`] = { name: attendee.name, position: attendee.position, email: attendee.email };
    attendeeAmount++;
  });

  return formObj;
}

function addAttendee() {
  tempAttendees.value.push({ localId: attendeeAmount, name: '', position: '', email: '' });
  attendeeAmount++;
}

function removeAttendee(index: number) {
  form.value.attendees = form.value.attendees.filter(attendee => attendee.localId !== index);
}

const { create, edit } = useMeetingStore();

async function onSubmit() {
  const contacts = Object.keys(form.value).filter(key => key.startsWith('contact'));
  contacts.forEach((key) => {
    const contact = (form as any).value[key];
    form.value.attendees.push(
      { localId: 0, name: contact.name, position: contact.position, email: contact.email },
    );
  });

  if (mode.value === FormMode.CREATE) {
    await create(applicationId!.value!, form.value);
  } else {
    await edit(meeting!.value!.id, form.value);
  }

  tempAttendees.value = [];
  attendeeAmount = 0;

  reset('create-edit-meeting');
  emit('submit');
}
</script>
