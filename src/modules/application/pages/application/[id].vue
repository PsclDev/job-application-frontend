<template>
  <div class="mt-2">
    <ArchivedBadge v-if="application.isArchived" />
    <StatusBadge v-else :status="latestStatus.state" />
  </div>

  <div class="grid grid-cols-6 place-items-center">
    <div class="col-start-2 col-span-4 text-center">
      <p class="text-3xl font-extrabold text-gray-900">
        {{ application.name }}
      </p>
      <p class="text-xl font-extrabold text-gray-900">
        {{ application.description }}
      </p>
    </div>

    <div class="col-end-7 col-span-1">
      <div class="flex gap-5">
        <button class="text-emerald-200 hover:text-emerald-500" @click="showEditModal = true">
          <EditIcon size="1.5x" />
        </button>
        <a :href="application.jobUrl" target="_blank" class="text-emerald-200 hover:text-emerald-500">
          <ExternalLinkIcon size="1.5x" />
        </a>
        <button class="text-emerald-200 hover:text-emerald-500" @click="showMoveModal = true">
          <FolderIcon size="1.5x" />
        </button>
        <button v-if="application.isArchived" class="text-emerald-200 hover:text-emerald-500" @click="unarchiveAction">
          <InboxIcon size="1.5x" />
        </button>
        <button v-else class="text-emerald-200 hover:text-emerald-500" @click="archiveAction">
          <ArchiveIcon size="1.5x" />
        </button>
        <button class="text-red-200 hover:text-red-500" @click="removeAction">
          <Trash2Icon size="1.5x" />
        </button>
      </div>
    </div>
  </div>

  <div class="flex flex-col justify-center items-center mt-10">
    <div class="flex gap-5 mb-10">
      <button class="px-6 py-2 w-72 text-sm rounded shadow bg-emerald-100 hover:bg-emerald-300 text-emerald-500 hover:text-emerald-700" @click="showChangeStatusModal = true">
        {{ $t('modules.application.pages.application.change-status') }}
      </button>

      <button class="px-6 py-2 w-72 text-sm rounded shadow bg-emerald-100 hover:bg-emerald-300 text-emerald-500 hover:text-emerald-700" @click="showCreateMeetingModal = true">
        {{ $t('modules.application.pages.application.create-meeting') }}
      </button>
    </div>

    <QuillEditor ref="quillEditor" v-model:content="application.notes" content-type="html" theme="snow" @blur="editorBlur" />

    <div class="flex flex-wrap justify-center gap-5 mt-5">
      <div v-for="meeting in meetings" :key="meeting.id">
        <Meeting :meeting="meeting" />
      </div>
    </div>
  </div>

  <GDialog v-model="showEditModal">
    <EditApplication :mode="FormMode.EDIT" :application="application" @submit="submitEditModal" />
  </GDialog>

  <GDialog v-model="showMoveModal">
    <MoveApplication :mode="FormMode.EDIT" :application-id="application.id" :group-id="application.groupId" @submit="showMoveModal = false" />
  </GDialog>

  <GDialog v-model="showChangeStatusModal">
    <ChangeStatus :mode="FormMode.EDIT" :application-id="application.id" :status="application.status" @submit="showChangeStatusModal = false" />
  </GDialog>

  <GDialog v-model="showCreateMeetingModal">
    <CreateMeeting :mode="FormMode.CREATE" :application-id="id" @submit="submitCreateMeetingModal" />
  </GDialog>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, toRefs, watch } from 'vue';
import { useRouter } from 'vue-router';
import { ArchiveIcon, EditIcon, ExternalLinkIcon, FolderIcon, InboxIcon, Trash2Icon } from '@zhuowenli/vue-feather-icons';
import { ApplicationInterface, MeetingInterface } from '@shared';
import { storeToRefs } from 'pinia';
import { getLatestStatus } from '../../utils';
import ChangeStatus from '../../components/change-status.vue';
import EditApplication from '@/modules/application/components/create-edit.vue';
import MoveApplication from '@/modules/application/components/move-application.vue';
import { FormMode } from '@/modules/common/types';
import useBreadcrumbs from '@/modules/breadcrumbs/hooks/useBreadcrumbs';
import { useApplicationStore } from '@/modules/application/store/application.store';
import { useGroupStore } from '@/modules/group/store/group.store';
import { useMeetingStore } from '@/modules/meeting/store/meeting.store';
import Meeting from '@/modules/meeting/components/meeting.vue';
import CreateMeeting from '@/modules/meeting/components/create-edit.vue';

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});
const { id } = toRefs(props);
const quillEditor = ref();

const router = useRouter();
const { loadOne, applicationById, editNotes, archive, unarchive, remove } = useApplicationStore();
const { setBreadcrumbs, getGroupId } = useBreadcrumbs();

const application = ref<ApplicationInterface>(applicationById(id.value)!);

if (!application.value) {
  await loadOne(id.value);
  application.value = applicationById(id.value)!;
}

if (!application.value) {
  router.push(`/group/${getGroupId().value}`);
}

onMounted(() => {
  quillEditor.value.setHTML(application.value?.notes);
});
const initialNotes = ref<string>(application.value?.notes);

const { groupById } = useGroupStore();
const group = groupById(application.value.groupId)!;

const { meetings: meetingsToWatch, meetingsByApplicationId } = storeToRefs(useMeetingStore());
const meetings = ref<MeetingInterface[]>(meetingsByApplicationId.value(application.value.id));

watch(() => meetingsToWatch.value, () => {
  meetings.value = meetingsByApplicationId.value(application.value.id);
});

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
    label: application.value.name,
    value: id.value,
    translate: false,
    to: `/application/${id.value}`,
  },
]);

const latestStatus = computed(() => {
  return getLatestStatus(application.value.status);
});

const showEditModal = ref(false);
const showMoveModal = ref(false);
const showChangeStatusModal = ref(false);
const showCreateMeetingModal = ref(false);

async function archiveAction() {
  await archive(application.value.id, application.value.name);
}

async function unarchiveAction() {
  await unarchive(application.value.id, application.value.name);
}

async function removeAction() {
  await remove(application.value.id, application.value.name);
  router.push(`/group/${application.value.groupId}`);
}

function editorBlur() {
  if (initialNotes.value === quillEditor.value.getHTML()) {
    return;
  }

  editNotes(application.value.id, application.value.notes);
}

function submitEditModal() {
  showEditModal.value = false;
  application.value = applicationById(id.value)!;
}

function submitCreateMeetingModal() {
  showCreateMeetingModal.value = false;
  meetings.value = meetingsByApplicationId.value(application.value.id);
}
</script>

<route lang="yaml">
name: application
</route>
