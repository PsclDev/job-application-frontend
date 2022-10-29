<template>
  <div>
    <BaseCard class="w-112" :title="group.name" title-width="w-80" :description="group.description" action="modules.group.components.card.action" :archived="group.isArchived" :dropdown-options="dropdownOptions" @action-clicked="cardAction" @dropdown-clicked="async (option: DropdownOption) => await option.action()" />

    <GDialog v-model="showEditModal">
      <EditGroup :mode="FormMode.EDIT" :group="group" @submit="showEditModal = false" />
    </GDialog>
  </div>
</template>

<script lang="ts" setup>
import { PropType, ref, toRefs, watch } from 'vue';
import { GroupInterface } from '@shared';
import { useRouter } from 'vue-router';
import { useGroupStore } from '../store/group.store';
import EditGroup from '../components/create-edit.vue';
import { DropdownOption, FormMode } from '@/modules/common/types';

const props = defineProps({
  group: {
    type: Object as PropType<GroupInterface>,
    required: true,
  },
});

const router = useRouter();
const showEditModal = ref(false);

const { group } = toRefs(props);
const { archive, unarchive, remove } = useGroupStore();

const dropdownOptions = ref<Array<DropdownOption>>([]);

function generateDropdownOptions() {
  dropdownOptions.value = [...(group.value.isArchived
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

watch(() => group.value.isArchived, () => {
  generateDropdownOptions();
});

function cardAction() {
  router.push(`group/${group.value.id}`);
}

function edit() {
  showEditModal.value = true;
}

async function archiveAction() {
  await archive(group.value.id, group.value.name);
}

async function unarchiveAction() {
  await unarchive(group.value.id, group.value.name);
}

async function removeAction() {
  await remove(group.value.id, group.value.name);
}
</script>
