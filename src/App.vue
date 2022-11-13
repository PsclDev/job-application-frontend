<template>
  <suspense>
    <template v-if="loadedAllData">
      <div @drop.prevent="fileDrop($event)" @dragenter="drag" @dragover="drag">
        <router-view />
      </div>
    </template>
    <template v-else>
      <div class="flex justify-center">
        <LoadingIcon size="xl" />
      </div>
    </template>
  </suspense>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { useGroupStore } from '@module/group/store/group.store';
import { useFileStore } from '@module/file/store/file.store';
import { useApplicationStore } from '@module/application/store/application.store';
import { DEFAULT_APP_TITLE } from '@module/common/config';
import { useMeetingStore } from '@module/meeting/store/meeting.store';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';

const groupStore = useGroupStore();
const { loadAll: loadAllGroups } = groupStore;
const { loading: loadingGroups } = storeToRefs(groupStore);
loadAllGroups();

const applicationStore = useApplicationStore();
const { loadAll: loadAllApplications } = applicationStore;
const { loading: loadingApplications } = storeToRefs(applicationStore);
loadAllApplications();

const fileStore = useFileStore();
const { loadAll: loadAllFiles, uploadFiles } = fileStore;
const { loading: loadingFiles } = storeToRefs(fileStore);
loadAllFiles();

const meetingStore = useMeetingStore();
const { loadAll: loadAllMeetings } = meetingStore;
const { loading: loadingMeetings } = storeToRefs(meetingStore);
loadAllMeetings();

const loadedAllData = computed(() => {
  return !(loadingGroups.value && loadingApplications.value && loadingFiles.value && loadingMeetings.value);
});

const route = useRoute();

watch(() => route.name, () => {
  const capitalize = route.name!.toString().charAt(0).toUpperCase() + route.name!.toString().slice(1);
  document.title = `${capitalize} - ${DEFAULT_APP_TITLE}`;
});

function fileDrop(event: DragEvent) {
  uploadFiles(event.dataTransfer!.files);
}

function drag(e: DragEvent) {
  e.preventDefault();
}
</script>
