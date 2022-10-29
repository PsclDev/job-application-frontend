<template>
  <button type="button" class="inline-flex relative items-center p-2 text-sm font-medium text-center text-white bg-emerald-200 rounded-lg hover:bg-emerald-500 focus:ring-4 focus:outline-none focus:ring-emerald-300" @click="showCalendarModal = true">
    <CalendarIcon size="1.5x" />
    <div v-if="meetingsLength > 0" class="inline-flex absolute -top-2 -right-2 justify-center items-center w-6 h-6 text-xs font-bold text-white bg-emerald-400 rounded-full border-2 border-white">
      {{ meetingsLength }}
    </div>
  </button>

  <GDialog v-model="showCalendarModal">
    <Calendar />
  </GDialog>
</template>

<script lang="ts" setup>
import { CalendarIcon } from '@zhuowenli/vue-feather-icons';
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import Calendar from './calendar.vue';
import { useMeetingStore } from '@/modules/meeting/store/meeting.store';
import { isUpcoming } from '@/modules/common/utils';

const { meetings } = storeToRefs(useMeetingStore());

const meetingsLength = ref<number>(meetings.value.filter(meeting => isUpcoming(meeting.date)).length);

const showCalendarModal = ref(false);
</script>
