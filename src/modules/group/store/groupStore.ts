import { defineStore } from 'pinia';
import axios from 'axios';
import { GroupInterface } from '@shared';
import { CreateGroupInterface, UpdateGroupInterface } from '../types/create-group.interface';
import { Logger } from '@/modules/common/utils/logger';

export const useGroupStore = defineStore('group', {
  state: () => {
    return {
      logger: new Logger('GroupStore'),
      groups: [] as GroupInterface[],
      loading: false,
      error: null as String | null,
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
    async loadGroups() {
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
        this.logger.info('loadGroups', res.data.groups);
        this.groups = res.data.groups;
        this.sortGroups();
        this.loading = false;
      } catch (e) {
        this.loading = false;
        this.error = 'Couldn\'t fetch groups';
        this.logger.error('loadGroups', e);
      }
    },
    async loadGroupById(id: string) {
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
        this.logger.info('loadGroupById', res.data.group);
        this.groups = [res.data.group, ...this.groups.filter(group => group.id !== id)];
        this.sortGroups();
        this.loading = false;
      } catch (e) {
        this.loading = false;
        this.error = 'Couldn\'t fetch group';
        this.logger.error('loadGroupById', e);
      }
    },
    async createGroup(group: CreateGroupInterface) {
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
        this.logger.info('createGroup', res.data.createGroup);
        this.groups.push(res.data.createGroup);
      } catch (e) {
        this.error = `Failed to create group ${group}`;
        this.logger.error('createGroup', e);
      }
    },
    async updateGroup(id: string, group: UpdateGroupInterface) {
      try {
        const res = await axios.post<{ updateGroup: GroupInterface }>('', {
          query: `
          mutation {
            updateGroup(
              id: "${id}"
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
        this.logger.info('updateGroup', res.data.updateGroup);
        this.groups = this.groups.map((group) => {
          if (group.id === res.data.updateGroup.id) {
            return res.data.updateGroup;
          }
          return group;
        });
      } catch (e) {
        this.error = `Failed to update group ${group}`;
        this.logger.error('updateGroup', e);
      }
    },
    async archiveGroup(id: string) {
      try {
        const res = await axios.post<{ archiveGroup: boolean }>('', {
          query: `
          mutation {
            archiveGroup(id: "${id}")
          }
          `,
        });
        this.logger.info('archiveGroup', res.data.archiveGroup);

        this.groups = this.groups.map((group) => {
          if (group.id === id) {
            group.isArchived = true;
          }
          return group;
        },
        );

        this.sortGroups();
      } catch (e) {
        this.error = `Failed to archive group ${id}`;
        this.logger.error('archiveGroup', e);
      }
    },
    async unarchiveGroup(id: string) {
      try {
        const res = await axios.post<{ unarchiveGroup: boolean }>('', {
          query: `
          mutation {
            unarchiveGroup(id: "${id}")
          }
          `,
        });
        this.logger.info('unarchiveGroup', res.data.unarchiveGroup);

        this.groups = this.groups.map((group) => {
          if (group.id === id) {
            group.isArchived = false;
          }
          return group;
        },
        );

        this.sortGroups();
      } catch (e) {
        this.error = `Failed to unarchive group ${id}`;
        this.logger.error('unarchiveGroup', e);
      }
    },
    async deleteGroup(id: string) {
      try {
        const res = await axios.post<{ deleteGroup: boolean }>('', {
          query: `
          mutation {
            deleteGroup(id: "${id}")
          }
          `,
        });
        this.logger.info('deleteGroup', res.data);
        this.groups = this.groups.filter(group => group.id !== id);
      } catch (e) {
        this.error = 'Failed to delete group';
        this.logger.error('deleteGroup', e);
      }
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
    getGroups: state => state.groups,
    groupById: (state) => {
      return (id: string): GroupInterface | undefined => state.groups.find(group => group.id === id);
    },
  },
});
