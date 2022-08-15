<template>
  <div class="relative grid place-items-center mt-6">
    <div v-if="loading">
      <LoadingIcon />
    </div>
    <div v-else-if="error">
      <div class="text-red-600">
        {{ error }}
      </div>
    </div>
    <div v-else-if="application">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        {{ application.company }} - {{ application.name }}
        <span v-if="application.isArchived" class="inline-block mr-1 last:mr-0 py-1 px-2 rounded bg-indigo-200 text-xs font-semibold text-indigo-600 uppercase">
          Archived
        </span>
      </h2>
      <h3 class="text-center text-2xl text-gray-900">
        {{ application.description }}
      </h3>

      <div class="absolute top-4 right-3">
        <button class="py-2 px-3" @click="showEditModal = true">
          <Edit3Icon size="1.25x" />
        </button>
        <button class="py-2 px-3" @click="showMoveModal = true">
          <FolderIcon size="1.25x" />
        </button>
        <button class="py-2 px-3" @click="application!.isArchived ? unarchiveApplication(application!.id) : archiveApplication(application!.id)">
          <ArchiveIcon size="1.25x" />
        </button>
        <button class="py-2 px-3" @click="showDeleteModal = true">
          <Trash2Icon size="1.25x" />
        </button>
      </div>

      <QuillEditor ref="quillEditor" v-model:content="application.notes" content-type="html" theme="snow" @blur="editorBlur" />
    </div>
  </div>

  <MoveModal :id="application!.id" v-model="showMoveModal" :current-group-id="application!.groupId" />

  <BaseDeleteModal v-model="showDeleteModal" title="modules.application.modals.delete.title" description="modules.application.modals.delete.description" @deleted="deleted" />

  <Suspense>
    <CreateEditModal :id="application!.id" v-model="showEditModal" :mode="FormMode.EDIT" @edited="(editedApplication) => application = editedApplication" />
  </Suspense>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { onMounted, ref, toRefs } from 'vue';
import { ArchiveIcon, Edit3Icon, FolderIcon, Trash2Icon } from '@zhuowenli/vue-feather-icons';
import { useRouter } from 'vue-router';
import { GroupInterface } from '@shared/types';
import { useApplicationStore } from '../../store/applicationStore';
import CreateEditModal from '../../modals/create-edit.vue';
import { FormMode } from '../../../common/types/form-mode';
import MoveModal from '../../modals/move.vue';
import LoadingIcon from '@/components/common/buttons/LoadingIcon.vue';
import { Logger } from '@/modules/common/utils/logger';
import useBreadcrumbs from '@/modules/breadcrumbs/hooks/useBreadcrumbs';
import { useGroupStore } from '@/modules/group/store/groupStore';

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});
const logger = new Logger('ApplicationPage');
const { id } = toRefs(props);
const quillEditor = ref();
const showEditModal = ref(false);
const showMoveModal = ref(false);
const showDeleteModal = ref(false);
const { loading, error } = storeToRefs(useApplicationStore());

const { loadApplications, applicationById, deleteApplication, archiveApplication, unarchiveApplication, updateApplication } = useApplicationStore();
const { loadGroupById, groupById } = useGroupStore();
const router = useRouter();

await loadApplications();
const application = ref(applicationById(id.value));
const group = ref<GroupInterface | undefined>();
if (application.value) {
  await loadGroupById(application.value?.groupId);
  group.value = groupById(application.value?.groupId);
}

onMounted(() => {
  quillEditor.value.setHTML(application.value?.notes);
});

if (!application.value) {
  router.push('/groups');
}

const { setBreadcrumbs } = useBreadcrumbs();

setBreadcrumbs([
  {
    label: 'modules.group.pages.groups.overview',
    translate: true,
    to: '/groups',
  },
  {
    label: group.value!.name,
    translate: false,
    to: `/group/${application.value?.groupId}`,
  },
  {
    label: application.value!.name,
    translate: false,
    to: `/application/${application.value?.id}`,
  },
]);

logger.info('id', id.value, 'application', application.value);

function deleted() {
  deleteApplication(id.value);
  router.push(`/groups/${application.value?.groupId}`);
}

function editorBlur() {
  logger.info('editorBlur', quillEditor.value.getHTML());
  application.value!.notes = quillEditor.value.getHTML();
  updateApplication(application.value!.id, application.value!);
}
</script>

<route lang="yaml">
name: Application
</route>
