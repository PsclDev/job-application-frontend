import { defineStore } from 'pinia';
import axios from 'axios';
import { GroupInterface } from '@shared';
import { CreateGroupInterface, UpdateGroupInterface } from '@module/group/types/group.interface';
import { Logger } from '@module/common/utils/logger';
import { error as ErrorNotifiaction, success as SuccessNotifiaction } from '@global/NotificationPlugin';

export const useGroupStore = defineStore('group', {
  state: () => {
    return {
      logger: new Logger('GroupStore'),
      groups: [] as GroupInterface[],
      loading: false,
      resultData: `
        id
        name
        description
        applications {
          id
          name
        }
        isArchived
        createdAt
        updatedAt
        `,
    };
  },
  actions: {
    async loadAll() {
      try {
        this.loading = true;

        const res = await axios.post<{ groups: GroupInterface[] }>('', {
          query: `
          query {
            groups {
              ${this.resultData}
            }
          }
          `,
        });
        this.groups = res.data.groups;
        this.sortGroups();
        this.actionSucceeded('loadAll', 'Loaded all groups', res.data.groups);
      } catch (err) {
        this.catchError('loadAll', err, 'Couldn\'t load groups');
      }
    },
    async loadOne(id: string) {
      try {
        this.loading = true;

        const res = await axios.post<{ group: GroupInterface }>('', {
          query: `
          query {
            group(id: "${id}") {
              ${this.resultData}
            }
          }
          `,
        });
        this.groups.push(res.data.group);
        this.sortGroups();
        this.actionSucceeded('loadAll', `Loaded group: ${res.data.group.name}`, res.data.group);
      } catch (err) {
        this.catchError('loadAll', err, `Couldn\'t load group by id ${id}`);
      }
    },
    async create(group: CreateGroupInterface) {
      try {
        const res = await axios.post<{ createGroup: GroupInterface }>('', {
          query: `
          mutation {
            createGroup(
              input: {
                name: "${group.name}"
                description: "${group.description}"
              }
            ) {
              ${this.resultData}
            }
          }
          `,
        });
        this.groups.push(res.data.createGroup);
        this.sortGroups();
        this.actionSucceeded('create', `New group created: '${group.name}'`, group);
      } catch (err) {
        this.catchError('create', err, 'Failed to create group');
      }
    },
    async edit(id: string, update: UpdateGroupInterface) {
      try {
        const res = await axios.post<{ updateGroup: GroupInterface }>('', {
          query: `
          mutation {
            updateGroup(
              id: "${id}",
              input: {
                name: "${update.name}"
                description: "${update.description}"
              }
            ) {
              ${this.resultData}
            }
          }
          `,
        });
        this.groups = this.groups.map((group) => {
          if (group.id === id) {
            group = res.data.updateGroup;
          }
          return group;
        });
        this.sortGroups();
        this.actionSucceeded('edit', `Updated group: '${update.name}'`, update);
      } catch (err) {
        this.catchError('edit', err, `Update group failed: '${update.name}'`);
      }
    },
    async archive(id: string, name: string) {
      try {
        const res = await axios.post<{ archiveGroup: boolean }>('', {
          query: `
          mutation {
            archiveGroup(id: "${id}")
          }
          `,
        });

        this.groups = this.groups.map((group) => {
          if (group.id === id) {
            group.isArchived = true;
          }
          return group;
        });

        this.sortGroups();
        this.actionSucceeded('archive', `Archived group: '${name}'`, res.data.archiveGroup);
      } catch (err) {
        this.catchError('archive', err, `Couldn\'t archive group: '${name}'`);
      }
    },
    async unarchive(id: string, name: string) {
      try {
        const res = await axios.post<{ unarchiveGroup: boolean }>('', {
          query: `
          mutation {
            unarchiveGroup(id: "${id}")
          }
          `,
        });

        this.groups = this.groups.map((group) => {
          if (group.id === id) {
            group.isArchived = false;
          }
          return group;
        });

        this.sortGroups();
        this.actionSucceeded('unarchive', `Archived group: '${name}'`, res.data.unarchiveGroup);
      } catch (err) {
        this.catchError('unarchive', err, `Couldn\'t unarchive group: '${name}'`);
      }
    },
    async remove(id: string, name: string) {
      try {
        const res = await axios.post<{ deleteGroup: boolean }>('', {
          query: `
          mutation {
            deleteGroup(id: "${id}")
          }
          `,
        });

        this.groups = this.groups.filter(group => group.id !== id);
        this.actionSucceeded('remove', `Removed group: '${name}'`, res.data.deleteGroup);
      } catch (err) {
        this.catchError('remove', err, `Couldn\'t remove group: '${name}'`);
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
    sortGroups() {
      const sortGroups = (a: GroupInterface, b: GroupInterface) => {
        if (a.isArchived === b.isArchived) {
          return a.name.localeCompare(b.name);
        }
        return a.isArchived ? 1 : -1;
      };
      this.groups = this.groups.sort(sortGroups);
    },
  },
  getters: {
    groupById: (state) => {
      return (id: string): GroupInterface | undefined => state.groups.find(group => group.id === id);
    },
  },
});
