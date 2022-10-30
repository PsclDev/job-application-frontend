<template>
  <div>
    <BaseCard class="w-98" :title="meeting.title" title-width="w-80" :description="date" action="modules.meeting.components.card.action" :dropdown-options="dropdownOptions" @action-clicked="cardAction" @dropdown-clicked="async (option: DropdownOption) => await option.action()" />

    <GDialog v-model="showEditModal">
      <EditMeeting :mode="FormMode.EDIT" :meeting="meeting" @submit="showEditModal = false" />
    </GDialog>
  </div>
</template>

<script lang="ts" setup>
import { PropType, computed, ref, toRefs } from 'vue';
import { MeetingInterface } from '@shared';
import { useRouter } from 'vue-router';
import { DateTime } from 'luxon';
import { useMeetingStore } from '@module/meeting/store/meeting.store';
import { DropdownOption, FormMode } from '@module/common/types';
import EditMeeting from './create-edit.vue';

const props = defineProps({
  meeting: {
    type: Object as PropType<MeetingInterface>,
    required: true,
  },
});

const router = useRouter();
const showEditModal = ref(false);

const { meeting } = toRefs(props);
const { remove } = useMeetingStore();

const dropdownOptions = ref<Array<DropdownOption>>([]);

function generateDropdownOptions() {
  dropdownOptions.value = [
    {
      label: 'common.edit',
      action: edit,
    },
    {
      label: 'common.delete',
      class: 'text-white bg-red-500 hover:bg-red-700',
      action: removeAction,
    },
  ];
}
generateDropdownOptions();

const date = computed(() => {
  return DateTime.fromJSDate(new Date(meeting.value.date)).toFormat('dd.MM - HH:mm');
});

function cardAction() {
  router.push(`/meeting/${meeting.value.id}`);
}

function edit() {
  showEditModal.value = true;
}

async function removeAction() {
  await remove(meeting.value.id, meeting.value.title);
}
</script>
