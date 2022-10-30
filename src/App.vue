<template>
  <suspense>
    <div @drop.prevent="fileDrop($event)">
      <router-view />
    </div>
  </suspense>
</template>

<script setup lang="ts">
import { defineComponent } from 'vue';
import { useGroupStore } from '@module/group/store/group.store';
import { useFileStore } from '@module/file/store/file.store';
import { useApplicationStore } from '@module/application/store/application.store';
import { DEFAULT_APP_TITLE } from '@module/common/config';
import { useMeetingStore } from '@module/meeting/store/meeting.store';

const { loadAll: loadAllGroups } = useGroupStore();
loadAllGroups();

const { loadAll: loadAllApplications } = useApplicationStore();
loadAllApplications();

const { loadAll: loadAllFiles, uploadFiles } = useFileStore();
loadAllFiles();

const { loadAll: loadAllMeetings } = useMeetingStore();
loadAllMeetings();

defineComponent({
  watch: {
    $route: {
      handler() {
        this.setTitle();
      },
      immediate: true,
    },
  },
  methods: {
    setTitle() {
      document.title = `${String(this.$route.name)} - ${DEFAULT_APP_TITLE}`;
    },
  },
});

function fileDrop(event: DragEvent) {
  uploadFiles(event.dataTransfer!.files);
}
</script>
