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
    <div v-else-if="group">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        {{ group.name }}
      </h2>
      <h3 class="text-center text-2xl text-gray-900">
        {{ group.description }}
      </h3>
      <div class="mt-5 grid place-items-center">
        <div class="flex items-center mb-4">
          <input id="archived" v-model="showArchived" type="checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
          <label for="archived" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">{{ $t('modules.group.pages.group.showArchived') }}</label>
        </div>
        <button class="mb-5 rounded-lg px-4 py-2 bg-blue-700 text-green-100 hover:bg-blue-800 duration-300" @click="showCreateApplicationModal = true">
          {{ $t('modules.group.pages.group.create') }}
        </button>
      </div>

      <div class="absolute top-4 right-3">
        <button class="py-2 px-3" @click="showEditModal = true">
          <Edit3Icon size="1.25x" />
        </button>
        <button class="py-2 px-3" @click="showDeleteModal = true">
          <Trash2Icon size="1.25x" />
        </button>
      </div>

      <div class="flex flex-row flex-wrap gap-4">
        <ApplicationCard v-for="application in applications" :key="application.id" :application="application" />
      </div>
    </div>
  </div>

  <BaseDeleteModal v-model="showDeleteModal" title="modules.group.modals.delete.title" description="modules.group.modals.delete.description" @deleted="deleted" />

  <Suspense>
    <CreateEditModal :id="group!.id" v-model="showEditModal" :mode="FormMode.EDIT" @edited="(editedGroup) => group = editedGroup" />
  </Suspense>
  <Suspense>
    <CreateApplicationModal v-model="showCreateApplicationModal" :group-id="group!.id" :mode="FormMode.CREATE" />
  </Suspense>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { computed, ref, toRefs } from 'vue';
import { Edit3Icon, Trash2Icon } from '@zhuowenli/vue-feather-icons';
import { useRouter } from 'vue-router';
import { useGroupStore } from '../../store/groupStore';
import CreateEditModal from '../../modals/create-edit.vue';
import { FormMode } from '../../../common/types/form-mode';
import ApplicationCard from '../../../application/components/application-card.vue';
import CreateApplicationModal from '@/modules/application/modals/create-edit.vue';
import LoadingIcon from '@/components/common/buttons/LoadingIcon.vue';
import { Logger } from '@/modules/common/utils/logger';
import useBreadcrumbs from '@/modules/breadcrumbs/hooks/useBreadcrumbs';
import { useApplicationStore } from '@/modules/application/store/applicationStore';

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});
const logger = new Logger('GroupPage');
const { id } = toRefs(props);
const showArchived = ref(false);
const showDeleteModal = ref(false);
const showEditModal = ref(false);
const showCreateApplicationModal = ref(false);
const { loading, error } = storeToRefs(useGroupStore());

const { loadGroups, groupById, deleteGroup } = useGroupStore();
const { loadApplicationsByGroupId, applicationsByGroupId } = useApplicationStore();
const router = useRouter();

await loadGroups();
const group = ref(groupById(id.value));

if (!group.value) {
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
    to: `/group/${group.value?.id}`,
  },
]);

logger.info('id', id.value, 'group', group.value);

const applications = computed(() => {
  const groupApplications = ref(applicationsByGroupId(group.value!.id)!);
  return showArchived.value ? groupApplications.value : groupApplications.value.filter(application => !application.isArchived);
});

loadApplicationsByGroupId(group.value!.id);

function deleted() {
  deleteGroup(id.value);
  router.push('/groups');
}
</script>

<route lang="yaml">
name: Group
</route>
