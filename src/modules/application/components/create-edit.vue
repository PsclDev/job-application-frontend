<template>
  <div class="p-5 flex flex-col justify-center">
    <p class="text-2xl text-bold text-center mb-8">
      {{ $t(mode === 'CREATE' ? 'modules.application.modal.form.create' : 'modules.application.modal.form.edit') }}
    </p>

    <FormKit
      v-model="form"
      type="form"
      :submit-label="$t(mode === 'CREATE' ? 'common.create' : 'common.edit')"
      @submit="onSubmit"
    >
      <FormKit
        name="name"
        type="text"
        :label="$t('modules.application.modal.form.name')"
        minlength="3"
        maxlength="50"
        validation-visibility="dirty"
        validation="required"
      />

      <FormKit
        name="description"
        type="text"
        :label="$t('modules.application.modal.form.description')"
        maxlength="155"
        validation-visibility="dirty"
      />

      <FormKit
        name="company"
        type="text"
        :label="$t('modules.application.modal.form.company')"
        minlength="3"
        maxlength="155"
        validation-visibility="dirty"
        validation="required"
      />

      <FormKit
        name="jobUrl"
        type="url"
        :label="$t('modules.application.modal.form.job-url')"
        maxlength="155"
        validation-visibility="live"
        validation="url"
      />

      <FormKit
        type="group"
        name="contact"
      >
        <FormKit
          type="text"
          name="name"
          :label="$t('modules.application.modal.form.contact-name')"
          minlength="3"
          maxlength="50"
          validation-visibility="dirty"
        />
        <FormKit
          type="text"
          name="position"
          :label="$t('modules.application.modal.form.contact-position')"
          minlength="2"
          maxlength="50"
          validation-visibility="dirty"
        />
        <FormKit
          type="email"
          name="email"
          :label="$t('modules.application.modal.form.contact-email')"
          validation-visibility="live"
          validation="email"
        />
      </FormKit>

      <FormKit
        name="status"
        type="group"
      >
        <div class="flex justify-between gap-5">
          <div class="grow">
            <FormKit
              name="state"
              type="select"
              :options="stateOptions"
              :label="$t('modules.application.modal.form.status-state')"
              validation="required"
            />
          </div>
          <div class="grow">
            <FormKit
              type="date"
              name="date"
              :label="$t('modules.application.modal.form.status-date')"
              validation="required"
            />
          </div>
        </div>
      </FormKit>
    </FormKit>
  </div>
</template>

<script lang="ts" setup>
import { PropType, getCurrentInstance, ref, toRefs } from 'vue';
import { ApplicationInterface, StateEnum } from '@shared';
import { DateTime } from 'luxon';
import { CreateApplicationInterface } from '../types/application.interface';
import { useApplicationStore } from '../store/application.store';
import { FormMode } from '@/modules/common/types';

const props = defineProps({
  mode: {
    type: String as PropType<FormMode>,
    default: 'CREATE',
  },
  groupId: {
    type: String,
    required: false,
  },
  application: {
    type: Object as PropType<ApplicationInterface>,
  },
});

const emit = defineEmits(['submit']);

const { mode, groupId, application } = toRefs(props);

const stateOptions = ref({} as any);
const app = getCurrentInstance();
const translation = app?.appContext.config.globalProperties.$t;
Object.keys(StateEnum).forEach((s: string) => {
  stateOptions.value[s] = translation(`enum.state.${s}`);
});

const initialState = ref<CreateApplicationInterface>({
  name: '',
  description: '',
  company: '',
  jobUrl: '',
  contact: {
    name: '',
    position: '',
    email: '',
  },
  status: {
    state: StateEnum.PENDING,
    date: DateTime.now().toFormat('yyyy-MM-dd'),
  },
});

const form = ref<CreateApplicationInterface>(
  {
    ...(mode.value === FormMode.EDIT ? applicationAsForm(application!.value!) : initialState.value),
  },
);

function applicationAsForm(application: ApplicationInterface): CreateApplicationInterface {
  const { name, description, company, jobUrl, contact, status } = application;
  const latestStatus = status.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  return {
    name,
    description,
    company,
    jobUrl,
    contact,
    status: {
      state: latestStatus.state,
      date: DateTime.fromJSDate(new Date(latestStatus.date)).toFormat('yyyy-MM-dd'),
    },
  };
}

const groupStore = useApplicationStore();
const { create, edit } = groupStore;

async function onSubmit() {
  console.log(form.value);
  if (mode.value === FormMode.CREATE) {
    await create(groupId!.value!, form.value);
  } else {
    await edit(application!.value!.id, form.value);
  }

  emit('submit');
}
</script>

<route lang="yaml">
name: create-edit-group
</route>
