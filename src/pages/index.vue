<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  beforeRouteEnter(_, __, next) {
    next('/groups');
  },
});
</script>
