<template>
  <div class="text-center section">
    <button @click="generateAttributes">
      Generate
    </button>
    <v-calendar
      class="custom-calendar max-w-full"
      :masks="masks"
      :attributes="attributes"
      disable-page-swipe
      is-expanded
    >
      <template #day-content="{ day, attributes }">
        <div class="flex flex-col h-full z-10 overflow-hidden">
          <span class="day-label text-sm text-gray-900">{{ day.day }}</span>
          <div class="flex-grow overflow-y-auto overflow-x-auto">
            <p
              v-for="attr in attributes"
              :key="attr.key"
              class="text-xs leading-tight rounded-sm p-1 mt-0 mb-1"
              :class="attr.customData.class"
            >
              {{ attr.customData.title }}
              {{ attr.customData.time }}
            </p>
          </div>
        </div>
      </template>
    </v-calendar>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { DateTime } from 'luxon';
import { ApplicationInterface, MeetingInterface } from '@shared';
import { useApplicationStore } from '@/modules/application/store/applicationStore';
import { Logger } from '@/modules/common/utils/logger';

const logger = new Logger('custom-calendar');

const route = useRoute();
const { loadApplications, allApplications } = useApplicationStore();

const masks = ref({ weekdays: 'WWW' });
const attributes = ref();
await generateAttributes();

watch(() => route.name, async () => {
  await generateAttributes();
});

const eventColors = [
  'slate',
  'gray',
  'zinc',
  'neutral',
  'stone',
  'red',
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'emerald',
  'teal',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'violet',
  'purple',
  'fuchsia',
  'pink',
  'rose',
];

interface event {
  key: number
  customData: {
    title: string
    time: string
    class: string
  }
  dates: Date
}

async function generateAttributes() {
  try {
    await loadApplications();
    const applications = allApplications;

    console.log('HUAN SOHN CAALENDAR', applications);
    let key = 0;
    const events: event[] = [];
    applications.forEach((application: ApplicationInterface) => {
      if (application.meetings) {
        application.meetings.forEach((meeting: MeetingInterface) => {
          const event = {
            key,
            customData: {
              title: meeting.title,
              time: DateTime.fromJSDate(meeting.date).toFormat('HH:mm'),
              class: 'bg-red-600 text-white',
            },
            dates: meeting.date,
          };
          key++;

          console.log('single event', event);

          events.push(event);
        });
      }
    });

    console.log('all events', events);
    attributes.value = events;
  } catch (error) {
    console.error(error);
  }
}
</script>

<!-- class: `bg-${eventColors[Math.floor(Math.random()
            * eventColors.length)]}-600 text-white`, -->
