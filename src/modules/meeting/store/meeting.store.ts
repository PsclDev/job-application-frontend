import { defineStore } from 'pinia';
import axios from 'axios';
import { MeetingInterface } from '@shared';
import { Logger } from '@/modules/common/utils/logger';
import { error as ErrorNotifiaction, success as SuccessNotifiaction } from '@/components/common/NotificationPlugin';

export const useMeetingStore = defineStore('meeting', {
  state: () => {
    return {
      logger: new Logger('MeetingStore'),
      meetings: [] as MeetingInterface[],
      loading: false,
      resultData: `
        id
        applicationId
        title
        date
        attendees {
            name
            position
            email
        }
        notes
        `,
    };
  },
  actions: {
    async loadAll() {
      try {
        this.loading = true;

        const res = await axios.post<{ meetings: MeetingInterface[] }>('', {
          query: `
          query {
            meetings {
              ${this.resultData}
            }
          }
          `,
        });
        this.meetings = res.data.meetings;
        this.sortMeetings();
        this.actionSucceeded('loadAll', 'Loaded all meetings', res.data.meetings);
      } catch (err) {
        this.catchError('loadAll', err, 'Couldn\'t load meetings');
      }
    },
    actionSucceeded(action: string, msg: string, ...args: unknown[]) {
      this.loading = false;
      this.logger.info(action, args);
      SuccessNotifiaction(msg);
    },
    catchError(action: string, err: unknown, errMsg: string) {
      this.loading = false;
      this.logger.error(action, err);
      ErrorNotifiaction(errMsg);
    },
    sortMeetings() {
      const sortMeetings = (a: MeetingInterface, b: MeetingInterface) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      };
      this.meetings = this.meetings.sort(sortMeetings);
    },
  },
});
