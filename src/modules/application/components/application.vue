<template>
  <div>
    <BaseCard class="w-112" :title="application.name" title-width="w-80" :description="application.description" action="modules.application.components.application.card-action" :archived="application.isArchived" :dropdown-options="dropdownOptions" @action-clicked="cardAction" @dropdown-clicked="async (option: DropdownOption) => await option.action()" />

    <GDialog v-model="showEditModal">
      <EditApplication :mode="FormMode.EDIT" :application="application" @submit="showEditModal = false" />
    </GDialog>
  </div>
</template>

<script lang="ts" setup>
import { PropType, ref, toRefs, watch } from 'vue';
import { ApplicationInterface } from '@shared';
import { useRouter } from 'vue-router';
import { useApplicationStore } from '../store/application.store';
import EditApplication from '../components/create-edit.vue';
import { DropdownOption, FormMode } from '@/modules/common/types';

const props = defineProps({
  application: {
    type: Object as PropType<ApplicationInterface>,
    required: true,
  },
});

const router = useRouter();
const showEditModal = ref(false);

const { application } = toRefs(props);
const { archive, unarchive, remove } = useApplicationStore();

const dropdownOptions = ref<Array<DropdownOption>>([]);

function generateDropdownOptions() {
  dropdownOptions.value = [...(application.value.isArchived
    ? [
        {
          label: 'common.unarchive',
          action: unarchiveAction,
        },
      ]
    : [
        {
          label: 'common.edit',
          action: edit,
        },
        {
          label: 'common.archive',
          action: archiveAction,
        },
      ]),
  {
    label: 'common.delete',
    class: 'text-white bg-red-500 hover:bg-red-700',
    action: removeAction,
  }];
}
generateDropdownOptions();

watch(() => application.value.isArchived, () => {
  generateDropdownOptions();
});

function cardAction() {
  router.push(`group/${application.value.id}`);
}

function edit() {
  showEditModal.value = true;
}

async function archiveAction() {
  await archive(application.value.id, application.value.name);
}

async function unarchiveAction() {
  await unarchive(application.value.id, application.value.name);
}

async function removeAction() {
  await remove(application.value.id, application.value.name);
}
</script>

<route lang="yaml">
name: application
</route>
