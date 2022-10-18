import { defineStore } from 'pinia';
import axios from 'axios';
import { FileInterface } from '@shared';
import FormData from 'form-data';
import { UploadFileOptions } from '../types/file-options.interface';
import { UpdateFileInterface } from '../types/edit-file.interface';
import { Logger } from '@/modules/common/utils/logger';
import { error as ErrorNotifiaction, info as InfoNotification, success as SuccessNotifiaction } from '@/components/common/NotificationPlugin';
import useBreadcrumbs from '@/modules/breadcrumbs/hooks/useBreadcrumbs';

export const useFileStore = defineStore('file', {
  state: () => {
    return {
      logger: new Logger('FileStore'),
      files: [] as FileInterface[],
      uploadOptions: {} as UploadFileOptions,
      loading: false,
      resultData: `
        id
        groupId
        applicationId
        name
        extension
        size
        mime
        `,
    };
  },
  actions: {
    async loadAll() {
      try {
        this.loading = true;

        const res = await axios.post<{ files: FileInterface[] }>('', {
          query: `
          query {
            files {
              ${this.resultData}
            }
          }
          `,
        });
        this.files = res.data.files;
        this.sortFiles();
        this.actionSucceeded('loadAll', 'Loaded all files', res.data.files);
      } catch (err) {
        this.catchError('loadAll', err, 'Couldn\'t load files');
      }
    },
    async getUploadOptions() {
      try {
        const res = await axios.post<{ fileOptions: UploadFileOptions }>('', {
          query: `
          query {
            fileOptions {
              allowedExtensions
              maxSize
            }
          }
          `,
        });
        this.uploadOptions = res.data.fileOptions;
      } catch (err) {
        this.catchError('getUploadOptions', err, 'Failed to get file upload options');
      }
    },
    async uploadFiles(files: FileList) {
      try {
        await this.getUploadOptions();

        const getFileExtension = (filename: string): string => `.${filename.split('.')[filename.split('.').length - 1]}`;
        const validExtension = (filename: string): boolean => this.uploadOptions.allowedExtensions.includes(getFileExtension(filename));
        const validSize = (filesize: number): boolean => filesize < this.uploadOptions.maxSize;

        const validFiles = Object.values(files).filter(file => validExtension(file.name) && validSize(file.size));
        InfoNotification(`Trying to upload ${validFiles.length} valid file(s)`);

        validFiles.forEach(async file => await this.uploadFile(file));
      } catch (err) {
        this.catchError('uploadFiles', err, 'Couldn\'t upload dropped files');
      }
    },
    async uploadFile(file: File) {
      try {
        const { getGroupId, getApplicationId } = useBreadcrumbs();
        const data = new FormData();
        const applicationId = getApplicationId().value !== '' ? `applicationId: \\"${getApplicationId().value}\\"` : '';
        const groupId = getGroupId().value !== '' ? `groupId: \\"${getGroupId().value}\\"` : '';

        data.append('operations', `{ "query": "mutation ($file: Upload!) { uploadFile(input: { ${groupId} ${applicationId} }, file: $file) { id groupId applicationId name extension data size mime createdAt updatedAt}}", "variables": { "file": null }}`);
        data.append('map', '{ "0": [ "variables.file" ]}');
        data.append('0', file);

        const res = await axios.post<{ uploadFile: FileInterface }>('', data);
        this.files = [res.data.uploadFile, ...this.files];
        this.actionSucceeded('uploadFile', `Uploaded '${file.name}'`);
      } catch (err) {
        this.catchError('uploadFile', err, `Failed to upload '${file.name}'`);
      }
    },
    async serve(id: string, name: string) {
      try {
        const res = await axios.post<{ serveFile: string }>('', {
          query: `
          query {
            serveFile(id: "${id}")
          }
          `,
        });

        return res.data.serveFile;
      } catch (err) {
        this.catchError('edit', err, `Couldn\`t serve file ${name}`);
      }
    },
    async edit(id: string, update: UpdateFileInterface) {
      try {
        const res = await axios.post<{ updateFile: FileInterface }>('', {
          query: `
          mutation {
            updateFile(
              id: "${id}",
              input: {
                name: "${update.name}"
              }
            ) {
              ${this.resultData}
            }
          }
          `,
        });

        this.files = this.files.map((file) => {
          if (file.id === id) {
            file = res.data.updateFile;
          }
          return file;
        });
        this.sortFiles();
        this.actionSucceeded('edit', `Renamed successfully to: '${update.name}'`, res.data.updateFile);
      } catch (err) {
        this.catchError('edit', err, 'Couldn\'t edit file');
      }
    },
    async remove(id: string, name: string) {
      try {
        const res = await axios.post<{ deleteFile: boolean }>('', {
          query: `
          mutation {
            deleteFile(id: "${id}")
          }
          `,
        });

        this.files = this.files.filter(file => file.id !== id);
        this.actionSucceeded('remove', `Removed file: '${name}'`, res.data.deleteFile);
      } catch (err) {
        this.catchError('remove', err, `Couldn\'t remove file: '${name}'`);
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
    sortFiles() {
      const sortFiles = (a: FileInterface, b: FileInterface) => {
        return a.name.localeCompare(b.name);
      };
      this.files = this.files.sort(sortFiles);
    },
  },
  getters: {
    getGlobalFiles: state => state.files.filter(file => file.groupId === null && file.applicationId === null),
    getGroupFiles: (state) => {
      return (groupId: string) => state.files.filter(file => file.groupId === groupId && file.applicationId === null);
    },
    getApplicationFiles: (state) => {
      return (applicationId: string) => state.files.filter(file => file.groupId === null && file.applicationId === applicationId);
    },
  },
});
