<template>
  <ArchivedBadge v-if="group?.isArchived" class="mt-2" />

  <div class="grid grid-cols-6 place-items-center">
    <div class="col-start-2 col-span-4 text-center">
      <p class="text-3xl font-extrabold text-gray-900">
        {{ group?.name }}
      </p>
      <p class="text-xl font-extrabold text-gray-900">
        {{ group?.description }}
      </p>
    </div>

    <div class="col-end-7 col-span-1">
      <div class="flex gap-5">
        <button class="text-emerald-200 hover:text-emerald-500" @click="showEditModal = true">
          <EditIcon size="1.5x" />
        </button>
        <button v-if="group?.isArchived" class="text-emerald-200 hover:text-emerald-500" @click="unarchiveAction">
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
    <button class="px-6 py-2 w-112 text-sm rounded shadow bg-emerald-100 hover:bg-emerald-300 text-emerald-500 hover:text-emerald-700">
      {{ $t('modules.group.pages.group.create') }}
    </button>

    <div class="mt-16">
      applications
    </div>

    <GDialog v-model="showEditModal">
      <EditGroup :mode="FormMode.EDIT" :group="group" @submit="submitEditModal" />
    </GDialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import { ArchiveIcon, EditIcon, InboxIcon, Trash2Icon } from '@zhuowenli/vue-feather-icons';
import { useGroupStore } from '../../store/group.store';
import EditGroup from '../../components/create-edit.vue';
import { FormMode } from '@/modules/common/types';
import useBreadcrumbs from '@/modules/breadcrumbs/hooks/useBreadcrumbs';

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});
const { id } = toRefs(props);

const router = useRouter();
const { groupById, archive, unarchive, remove } = useGroupStore();

const group = ref(groupById(id.value));

if (!group.value) {
  router.push('/groups');
}

const { setBreadcrumbs } = useBreadcrumbs();
setBreadcrumbs([
  {
    label: 'modules.group.pages.groups.title',
    value: '',
    translate: true,
    to: '/groups',
  },
  {
    label: group.value!.name,
    value: id.value,
    translate: false,
    to: `/group/${id.value}`,
  },
]);

const showEditModal = ref(false);
const showArchivedStorageKey = 'show-archived';
const showArchived = ref(false);

function archivedChanged() {
  localStorage.setItem(showArchivedStorageKey, showArchived.value.toString());
}

if (localStorage.getItem(showArchivedStorageKey)) {
  showArchived.value = localStorage.getItem(showArchivedStorageKey) === 'true';
}

async function archiveAction() {
  await archive(group.value!.id, group.value!.name);
}

async function unarchiveAction() {
  await unarchive(group.value!.id, group.value!.name);
}

async function removeAction() {
  await remove(group.value!.id, group.value!.name);
  router.push('/groups');
}

function submitEditModal() {
  showEditModal.value = false;
  group.value = groupById(id.value);
}
</script>

<route lang="yaml">
name: group
</route>
