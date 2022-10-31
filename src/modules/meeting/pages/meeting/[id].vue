<template>
  <div class="grid grid-cols-6 place-items-center">
    <div class="col-start-2 col-span-4 text-center">
      <p class="text-3xl font-extrabold text-gray-900">
        {{ meeting.title }}
      </p>
      <p class="text-xl font-extrabold text-gray-900">
        {{ DateTime.fromJSDate(new Date(meeting.date)).toFormat('dd.MM.yyyy HH:mm') }}
      </p>
    </div>

    <div class="col-end-7 col-span-1">
      <div class="flex gap-5">
        <a :href="meeting.link" target="_blank" class="text-emerald-200 hover:text-emerald-500">
          <ExternalLinkIcon size="1.5x" />
        </a>
        <button class="text-emerald-200 hover:text-emerald-500" @click="showEditModal = true">
          <EditIcon size="1.5x" />
        </button>
        <button class="text-red-200 hover:text-red-500" @click="removeAction">
          <Trash2Icon size="1.5x" />
        </button>
      </div>
    </div>
  </div>

  <div class="flex flex-col justify-center items-center mt-10">
    <div class="flex gap-3">
      <template v-for="attendee in meeting.attendees" :key="attendee.email">
        <div class="block w-40 p-3 bg-white rounded-lg border border-gray-200 shadow-md cursor-pointer" @click="copyTo(attendee.email, `Copied mail: '${attendee.email}'`)">
          <div class="flex grow flex-col ">
            <p class="text-md text-center">
              {{ attendee.position }}
            </p>
            <p class="text-lg font-bold text-center truncate">
              {{ attendee.name }}
            </p>
          </div>
        </div>
      </template>
    </div>

    <div class="w-full mt-10">
      <QuillEditor ref="quillEditor" v-model:content="meeting.notes" content-type="html" theme="snow" @blur="editorBlur" />
    </div>
  </div>

  <GDialog v-model="showEditModal">
    <EditMeeting :mode="FormMode.EDIT" :meeting="meeting" @submit="submitEditModal" />
  </GDialog>
</template>

<script lang="ts" setup>
import { onMounted, ref, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import { MeetingInterface } from '@shared';
import { EditIcon, ExternalLinkIcon, Trash2Icon } from '@zhuowenli/vue-feather-icons';
import { DateTime } from 'luxon';
import { useMeetingStore } from '@module/meeting/store/meeting.store';
import EditMeeting from '@module/meeting/components/create-edit.vue';
import useBreadcrumbs from '@module/breadcrumbs/hooks/useBreadcrumbs';
import { useGroupStore } from '@module/group/store/group.store';
import { useApplicationStore } from '@module/application/store/application.store';
import { FormMode } from '@module/common/types';
import useClipboard from '@module/common/hooks/useClipboard';

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});
const { id } = toRefs(props);
const quillEditor = ref();

const router = useRouter();
const { loadOne, meetingById, editNotes, remove } = useMeetingStore();
const { copyTo } = useClipboard();

const meeting = ref<MeetingInterface>(meetingById(id.value)!);

if (!meeting.value) {
  await loadOne(id.value);
  meeting.value = meetingById(id.value)!;
}

if (!meeting.value) {
  router.push('/groups');
}

onMounted(() => {
  quillEditor.value.setHTML(meeting.value.notes);
});
const initialNotes = ref<string>(meeting.value.notes);

const { applicationById } = useApplicationStore();
const application = applicationById(meeting.value.applicationId)!;

const { groupById } = useGroupStore();
const group = groupById(application.groupId)!;

const { setBreadcrumbs } = useBreadcrumbs();
setBreadcrumbs([
  {
    label: 'modules.group.pages.groups.title',
    value: '',
    translate: true,
    to: '/groups',
  },
  {
    label: group.name,
    value: group.id,
    translate: false,
    to: `/group/${group.id}`,
  },
  {
    label: application.name,
    value: application.id,
    translate: false,
    to: `/application/${id.value}`,
  },
  {
    label: meeting.value.title,
    value: id.value,
    translate: false,
    to: `/meeting/${id.value}`,
  },
]);

const showEditModal = ref(false);

async function removeAction() {
  await remove(meeting.value.id, meeting.value.title);
  router.push(`/application/${application.id}`);
}

function editorBlur() {
  if (initialNotes.value === quillEditor.value.getHTML()) {
    return;
  }

  editNotes(meeting.value.id, meeting.value.notes);
}

function submitEditModal() {
  showEditModal.value = false;
  meeting.value = meetingById(id.value)!;
}
</script>

<route lang="yaml">
name: meeting
</route>
