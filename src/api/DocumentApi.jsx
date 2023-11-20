import axiosClient from './AxiosClient';

export const DocumentApi = {
    getTree: async function (lessonId) {
        const response = axiosClient
            .request({
                url: '/document/get-document-tree',
                method: 'GET',
                params: {
                    lessonId: lessonId,
                },
            })
            .catch(function (error) {
                throw error;
            });

        return response;
    },

    create: async function (body) {
        const response = axiosClient
            .request({
                url: '/document/create',
                method: 'POST',
                data: body,
            })
            .catch(function (error) {
                throw error;
            });

        return response;
    },

    upload: async function (file) {
        const response = axiosClient
            .request({
                url: '/document/upload-document',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                method: 'POST',
                data: file,
            })
            .catch(function (error) {
                throw error;
            });

        return response;
    },

    download: async function (documentId) {
        const response = axiosClient
            .request({
                url: '/document/download-document',
                method: 'GET',
                responseType: 'arraybuffer',
                params: {
                    documentId: documentId,
                },
            })
            .catch(function (error) {
                throw error;
            });

        return response;
    },

    saveReplace: async function (data) {
        const response = await axiosClient
            .request({
                url: '/document/save-file',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                method: 'POST',
                data: data,
            })
            .catch(function (error) {
                throw error;
            });

        return response;
    },

    delete: async function (documentId) {
        const response = axiosClient
            .request({
                url: '/document/delete',
                method: 'DELETE',
                params: {
                    documentId: documentId,
                },
            })
            .catch(function (error) {
                throw error;
            });

        return response;
    },
};
