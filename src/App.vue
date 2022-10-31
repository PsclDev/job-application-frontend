<template>
  <suspense>
    <div @drop.prevent="fileDrop($event)">
      <router-view />
    </div>
  </suspense>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { useGroupStore } from '@module/group/store/group.store';
import { useFileStore } from '@module/file/store/file.store';
import { useApplicationStore } from '@module/application/store/application.store';
import { DEFAULT_APP_TITLE } from '@module/common/config';
import { useMeetingStore } from '@module/meeting/store/meeting.store';
import { useRoute } from 'vue-router';

const { loadAll: loadAllGroups } = useGroupStore();
loadAllGroups();

const { loadAll: loadAllApplications } = useApplicationStore();
loadAllApplications();

const { loadAll: loadAllFiles, uploadFiles } = useFileStore();
loadAllFiles();

const { loadAll: loadAllMeetings } = useMeetingStore();
loadAllMeetings();

const route = useRoute();

watch(() => route.name, () => {
  const capitalize = route.name!.toString().charAt(0).toUpperCase() + route.name!.toString().slice(1);
  document.title = `${capitalize} - ${DEFAULT_APP_TITLE}`;
});

function fileDrop(event: DragEvent) {
  uploadFiles(event.dataTransfer!.files);
}
</script>
