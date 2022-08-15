import { defineStore } from 'pinia';
import axios from 'axios';
import { ApplicationInterface } from '@shared/types';
import { CreateApplicationInterface, UpdateApplicationInterface } from '../types/create-application.interface';
import { Logger } from '@/modules/common/utils/logger';

// TODO: simplify query in a const
// TODO: replace this.error with notification
export const useApplicationStore = defineStore('application', {
  state: () => {
    return {
      logger: new Logger('ApplicationStore'),
      applications: [] as ApplicationInterface[],
      loading: false,
      error: null as String | null,
    };
  },
  actions: {
    async loadApplications() {
      try {
        this.loading = true;

        const res = await axios.post<{ applications: ApplicationInterface[] }>('', {
          query: `
                query {
                  applications {
                    groupId
                    id
                    name
                    description
                    company
                    contact {
                      name
                      position
                      email
                    }
                    jobUrl
                    status
                    notes
                    isArchived
                    createdAt
                    updatedAt
                  }
                }
              `,
        });
        this.logger.info('loadApplications', res.data.applications);

        this.applications = res.data.applications;
        this.sortApplications();
        this.loading = false;
      } catch (e) {
        this.loading = false;
        this.error = 'Couldn\'t fetch applications';
        this.logger.error('loadApplications', e);
      }
    },
    async loadApplicationsByGroupId(groupId: string) {
      try {
        this.loading = true;

        const res = await axios.post<{ applicationsByGroupId: ApplicationInterface[] }>('', {
          query: `
            query {
              applicationsByGroupId(groupId: "${groupId}") {
                groupId
                id
                name
                description
                company
                contact {
                  name
                  position
                  email
                }
                jobUrl
                status
                notes
                isArchived
                createdAt
                updatedAt
              }
            }
          `,
        });
        this.logger.info('loadApplicationsByGroupId', groupId, 'result', res.data.applicationsByGroupId);

        if (res.data.applicationsByGroupId) {
          this.applications = [...res.data.applicationsByGroupId, ...this.applications.filter(app => app.groupId !== groupId)];
          this.sortApplications();
        }
        this.loading = false;
      } catch (e) {
        this.loading = false;
        this.error = 'Couldn\'t fetch applications';
        this.logger.error('loadApplicationsByGroupId', e);
      }
    },
    async createApplication(groupId: string, application: CreateApplicationInterface) {
      try {
        const contact = `
          contact: {
            name: "${application.contact.name}"
            position: "${application.contact.position}"
            email: "${application.contact.email}"
          }
        `;
        const res = await axios.post<{ createApplication: ApplicationInterface }>('', {
          query: `
          mutation {
            createApplication(
              input: {
                groupId: "${groupId}"
                name: "${application.name}"
                description: "${application.description}"
                company: "${application.company}"
                ${application.contact.name ? contact : ''}
                jobUrl: "${application.jobUrl}"
                status: "${application.status}"
                notes: "${application.notes}"
              }
            ) {
              groupId
              id
              name
              description
              company
              contact {
                name
                position
                email
              }
              jobUrl
              status
              notes
              isArchived
              createdAt
              updatedAt
            }
          }
          `,
        });
        this.logger.info('createApplication', res.data.createApplication);
        this.applications.push(res.data.createApplication);
      } catch (e) {
        this.error = `Failed to create application ${application}`;
        this.logger.error('createApplication', e);
      }
    },
    async updateApplication(id: string, application: UpdateApplicationInterface) {
      try {
        const contact = `
          contact: {
            name: "${application.contact?.name}"
            position: "${application.contact?.position}"
            email: "${application.contact?.email}"
          }
        `;
        const res = await axios.post<{ updateApplication: ApplicationInterface }>('', {
          query: `
          mutation {
            updateApplication(
              id: "${id}"
              input: {
                name: "${application.name}"
                description: "${application.description}"
                company: "${application.company}"
                ${application.contact?.name ? contact : ''}
                jobUrl: "${application.jobUrl}"
                status: "${application.status}"
                notes: "${application.notes}"
              }
            ) {
              groupId
              id
              name
              description
              company
              contact {
                name
                position
                email
              }
              jobUrl
              status
              notes
              isArchived
              createdAt
              updatedAt
            }
          }
          `,
        });
        this.logger.info('updateApplication', res.data.updateApplication);
        this.applications = this.applications.map((application) => {
          if (application.id === res.data.updateApplication.id) {
            return res.data.updateApplication;
          }
          return application;
        });
      } catch (e) {
        this.error = `Failed to update application ${application}`;
        this.logger.error('updateApplication', e);
      }
    },
    async moveApplication(id: string, groupId: string) {
      try {
        const res = await axios.post<{ archiveApplication: boolean }>('', {
          query: `
            mutation {
              moveApplication(
                id: "${id}"
                newGroupId: "${groupId}"
              ) {
                id
              }
            }
          `,
        });
        this.logger.info('moveApplication', res.data.archiveApplication);

        this.applications = this.applications.map((application) => {
          if (application.id === id) {
            application.isArchived = true;
          }
          return application;
        },
        );

        this.sortApplications();
      } catch (e) {
        this.error = `Failed to move application ${id} to group ${groupId}`;
        this.logger.error('moveApplication', e);
      }
    },
    async archiveApplication(id: string) {
      try {
        const res = await axios.post<{ archiveApplication: boolean }>('', {
          query: `
            mutation {
              archiveApplication(id: "${id}")
            }
          `,
        });
        this.logger.info('archiveApplication', res.data.archiveApplication);

        this.applications = this.applications.map((application) => {
          if (application.id === id) {
            application.isArchived = true;
          }
          return application;
        },
        );

        this.sortApplications();
      } catch (e) {
        this.error = `Failed to archive application ${id}`;
        this.logger.error('archiveApplication', e);
      }
    },
    async unarchiveApplication(id: string) {
      try {
        const res = await axios.post<{ unarchiveApplication: boolean }>('', {
          query: `
            mutation {
              unarchiveApplication(id: "${id}")
            }    
          `,
        });
        this.logger.info('unarchiveApplication', res.data.unarchiveApplication);

        this.applications = this.applications.map((application) => {
          if (application.id === id) {
            application.isArchived = false;
          }
          return application;
        },
        );

        this.sortApplications();
      } catch (e) {
        this.error = `Failed to unarchive application ${id}`;
        this.logger.error('unarchiveApplication', e);
      }
    },
    async deleteApplication(id: string) {
      try {
        const res = await axios.post<{ deleteApplication: boolean }>('', {
          query: `
            mutation {
              deleteApplication(id: "${id}")
            }
          `,
        });
        this.logger.info('deleteApplication', res.data);
        this.applications = this.applications.filter(application => application.id !== id);
      } catch (e) {
        this.error = 'Failed to delete application';
        this.logger.error('deleteApplication', e);
      }
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
