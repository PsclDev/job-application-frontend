<template>
  <div
    class="relative p-6 max-w-md bg-white rounded-lg border border-gray-200 shadow-md"
    :class="application.isArchived ? 'bg-gray-100' : ''"
  >
    <h4 class="mb-2 text-2xl font-bold text-ellipsis overflow-hidden tracking-tight text-gray-900 pr-9">
      {{ application.company }}
    </h4>
    <h5 class="mb-2 text-1xl font-bold text-ellipsis overflow-hidden tracking-tight text-gray-900 pr-9">
      {{ application.contact ? `${application.contact.name} - ${application.contact.email}` : '' }}
    </h5>
    <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
      {{ application.name }}
    </p>
    <a class="inline-flex items-center cursor-pointer py-2 px-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300" @click="enterApplication">
      {{ $t('modules.application.components.applicationcard.details') }}
      <ArrowRightIcon size="1.5x" class="ml-2 -mr-1 w-4 h-4" />
    </a>

    <div class="absolute top-4 right-3">
      <div class="dropdown inline-block relative">
        <button class="py-2 px-3">
          <MoreVerticalIcon size="1.25x" />
        </button>

        <div class="absolute w-36">
          <ul class="dropdown-menu cursor-pointer absolute hidden text-gray-700 pt-2 z-50">
            <li>
              <a class="rounded-t bg-gray-200 hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap" @click="showEditModal = true">{{ $t('common.edit') }}</a>
            </li>
            <li>
              <a class="rounded-t bg-gray-200 hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap" @click="showMoveModal = true">{{ $t('modules.application.components.applicationcard.move') }}</a>
            </li>
            <li v-if="application.isArchived">
              <a class="rounded-t bg-gray-200 hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap" @click="unarchiveApplication(application.id)">{{ $t('common.unarchive') }}</a>
            </li>
            <li v-else>
              <a class="rounded-t bg-gray-200 hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap" @click="archiveApplication(application.id)">{{ $t('common.archive') }}</a>
            </li>
            <li>
              <a class="rounded-t text-white bg-red-400 hover:bg-red-600 py-2 px-4 block whitespace-no-wrap" @click="showDeleteModal = true">{{ $t('common.delete') }}</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <MoveModal :id="application.id" v-model="showMoveModal" :current-group-id="application.groupId" />

  <BaseDeleteModal v-model="showDeleteModal" title="modules.application.modals.delete.title" description="modules.application.modals.delete.description" @deleted="deleteApplication(application.id)" />

  <Suspense>
    <CreateEditModal :id="application.id" v-model="showEditModal" :mode="FormMode.EDIT" />
  </Suspense>
</template>

<script lang="ts" setup>
import { ApplicationInterface } from '@shared';
import { PropType, ref, toRefs } from 'vue';
import { ArrowRightIcon, MoreVerticalIcon } from '@zhuowenli/vue-feather-icons';
import { useRouter } from 'vue-router';
import { FormMode } from '../../common/types/form-mode';
import { useApplicationStore } from '../store/applicationStore';
import CreateEditModal from '../modals/create-edit.vue';
import MoveModal from '../modals/move.vue';

const props = defineProps({
  application: {
    type: Object as PropType<ApplicationInterface>,
    required: true,
  },
});

const { application } = toRefs(props);
const showEditModal = ref(false);
const showMoveModal = ref(false);
const showDeleteModal = ref(false);
const { archiveApplication, unarchiveApplication, deleteApplication } = useApplicationStore();
const router = useRouter();

function enterApplication() {
  router.push(`/application/${application.value.id}`);
}
</script>

<style>
.dropdown:hover .dropdown-menu {
  display: block;
}
</style>
