<template>
  <div class="text-center section">
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
            <div
              v-for="attr in attributes"
              :key="attr.key"
              class="cursor-pointer"
              :class="attr.customData.class"
              @click="showDetail(attr.customData.id)"
            >
              <p
                class="text-xs leading-tight rounded-sm p-1 mt-0 mb-1"
              >
                {{ attr.customData.title }}<br>
                {{ attr.customData.time }}
              </p>
            </div>
          </div>
        </div>
      </template>
    </v-calendar>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { DateTime } from 'luxon';
import { MeetingInterface } from '@shared';
import { event } from '../types/event.interface';
import { useMeetingStore } from '@/modules/meeting/store/meeting.store';
import { isUpcoming } from '@/modules/common/utils';

const { meetings } = useMeetingStore();

const masks = ref({ weekdays: 'WWW' });
const attributes = ref();

const colorMapping = {} as any;
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

await generateAttributes();

function generateAttributes() {
  let key = 0;
  const events: event[] = [{
    key,
    customData: {
      title: '- TODAY -',
      time: '',
      class: 'bg-red-600 text-white font-bold',
    },
    dates: new Date(DateTime.now().toJSDate()),
  }];

  meetings.forEach((meeting: MeetingInterface) => {
    const color = generateColor(meeting.applicationId);

    const event = {
      key,
      customData: {
        id: meeting.id,
        title: meeting.title,
        time: DateTime.fromJSDate(new Date(meeting.date)).toFormat('HH:mm'),
        class: `bg-${color}-600 text-white ${isUpcoming(meeting.date, false) ? '' : 'opacity-25'}`,
      },
      dates: new Date(meeting.date),
    };
    key++;

    events.push(event);
  });

  attributes.value = events;
}

function generateColor(applicationId: string) {
  if (!colorMapping[applicationId]) {
    colorMapping[applicationId] = eventColors[Math.floor(Math.random() * eventColors.length)];
  }

  return colorMapping[applicationId];
}

function showDetail(id: string) {
  console.log('showDetail(): TODO');
}
</script>
