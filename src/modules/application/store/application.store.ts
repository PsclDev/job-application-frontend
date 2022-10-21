import { defineStore } from 'pinia';
import axios from 'axios';
import { ApplicationInterface } from '@shared';
import { CreateApplicationInterface, UpdateApplicationInterface } from '../types/application.interface';
import { Logger } from '@/modules/common/utils/logger';
import { error as ErrorNotifiaction, success as SuccessNotifiaction } from '@/components/common/NotificationPlugin';

export const useApplicationStore = defineStore('application', {
  state: () => {
    return {
      logger: new Logger('ApplicationStore'),
      applications: [] as ApplicationInterface[],
      loading: false,
      resultData: `
        id
        groupId
        name
        description
        company
        contact {
            name
            position
            email
        }
        jobUrl
        status {
            state
            date
        }
        notes
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

        const res = await axios.post<{ applications: ApplicationInterface[] }>('', {
          query: `
          query {
            applications {
              ${this.resultData}
            }
          }
          `,
        });
        this.applications = res.data.applications;
        this.sortApplications();
        this.actionSucceeded('loadAll', 'Loaded all applications', res.data.applications);
      } catch (err) {
        this.catchError('loadAll', err, 'Couldn\'t load applications');
      }
    },
    async create(groupId: string, application: CreateApplicationInterface) {
      try {
        const res = await axios.post<{ createApplication: ApplicationInterface }>('', {
          query: `
          mutation {
            createApplication(
              input: {
                groupId: "${groupId}"
                name: "${application.name}"
                description: "${application.description}"
                company: "${application.company}"
                jobUrl: "${application.jobUrl}"
                contact: {
                    name: "${application.contact.name}"
                    position: "${application.contact.position}"
                    email: "${application.contact.email}"
                }
                status: {
                    state: "${application.status.state}"
                    date: "${application.status.date}"
                }
              }
            ) {
              ${this.resultData}
            }
          }
          `,
        });
        this.applications.push(res.data.createApplication);
        this.sortApplications();
        this.actionSucceeded('create', `New application created: '${application.name}'`, application);
      } catch (err) {
        this.catchError('create', err, 'Failed to create application');
      }
    },
    async edit(id: string, update: UpdateApplicationInterface) {
      try {
        const res = await axios.post<{ updateApplication: ApplicationInterface }>('', {
          query: `
          mutation {
            updateApplication(
              id: "${id}",
              input: {
                name: "${update.name}"
                description: "${update.description}"
                company: "${update.company}"
                jobUrl: "${update.jobUrl}"
                contact: {
                    name: "${update.contact?.name}"
                    position: "${update.contact?.position}"
                    email: "${update.contact?.email}"
                }
                status: {
                    state: "${update.status?.state}"
                    date: "${update.status?.date}"
                }
              }
            ) {
              ${this.resultData}
            }
          }
          `,
        });
        this.applications = this.applications.map((application) => {
          if (application.id === id) {
            application = res.data.updateApplication;
          }
          return application;
        });
        this.sortApplications();
        this.actionSucceeded('edit', `Updated application: '${update.name}'`, update);
      } catch (err) {
        this.catchError('edit', err, `Update application failed: '${update.name}'`);
      }
    },
    async archive(id: string, name: string) {
      try {
        const res = await axios.post<{ archiveApplication: boolean }>('', {
          query: `
          mutation {
            archiveApplication(id: "${id}")
          }
          `,
        });

        this.applications = this.applications.map((application) => {
          if (application.id === id) {
            application.isArchived = true;
          }
          return application;
        });

        this.sortApplications();
        this.actionSucceeded('archive', `Archived application: '${name}'`, res.data.archiveApplication);
      } catch (err) {
        this.catchError('archive', err, `Couldn\'t archive application: '${name}'`);
      }
    },
    async unarchive(id: string, name: string) {
      try {
        const res = await axios.post<{ unarchiveApplication: boolean }>('', {
          query: `
          mutation {
            unarchiveApplication(id: "${id}")
          }
          `,
        });

        this.applications = this.applications.map((application) => {
          if (application.id === id) {
            application.isArchived = false;
          }
          return application;
        });

        this.sortApplications();
        this.actionSucceeded('unarchive', `Archived application: '${name}'`, res.data.unarchiveApplication);
      } catch (err) {
        this.catchError('unarchive', err, `Couldn\'t unarchive application: '${name}'`);
      }
    },
    async remove(id: string, name: string) {
      try {
        const res = await axios.post<{ deleteApplication: boolean }>('', {
          query: `
          mutation {
            deleteApplication(id: "${id}")
          }
          `,
        });

        this.applications = this.applications.filter(application => application.id !== id);
        this.actionSucceeded('remove', `Removed application: '${name}'`, res.data.deleteApplication);
      } catch (err) {
        this.catchError('remove', err, `Couldn\'t remove application: '${name}'`);
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
    sortApplications() {
      const sortApplications = (a: ApplicationInterface, b: ApplicationInterface) => {
        if (a.isArchived === b.isArchived) {
          return a.name.localeCompare(b.name);
        }
        return a.isArchived ? 1 : -1;
      };
      this.applications = this.applications.sort(sortApplications);
    },
  },
  getters: {
    applicationsByGroupId: (state) => {
      return (groupId: string): ApplicationInterface[] => state.applications.filter(application => application.groupId === groupId);
    },
    applicationById: (state) => {
      return (id: string): ApplicationInterface | undefined => state.applications.find(application => application.id === id);
    },
  },
});
