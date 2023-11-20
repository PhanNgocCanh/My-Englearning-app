import axiosClient from './AxiosClient';

export const LessonApi = {
    getAll: async function () {
        const response = axiosClient
            .request({
                url: '/lesson/get-all',
                method: 'GET',
            })
            .catch(function (error) {
                throw error;
            });

        return response;
    },

    create: async function (body) {
        const response = axiosClient
            .request({
                url: '/lesson/create',
                method: 'POST',
                data: body,
            })
            .catch(function (error) {
                throw error;
            });

        return response;
    },

    delete: async function (ids) {
        const response = axiosClient
            .request({
                url: '/lesson/delete',
                method: 'DELETE',
                data: ids,
            })
            .catch(function (error) {
                throw error;
            });

        return response;
    },
};
