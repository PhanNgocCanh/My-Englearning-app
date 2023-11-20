import axiosClient from './AxiosClient';

export const CollectionApi = {
    getAll: async function (body) {
        const response = axiosClient
            .request({
                url: '/collection/get-all',
                method: 'POST',
                data: body,
            })
            .catch(function (error) {
                throw error;
            });

        return response;
    },

    create: async function (body) {
        const response = axiosClient
            .request({
                url: '/collection/create',
                method: 'POST',
                data: body,
            })
            .catch(function (error) {
                throw error;
            });

        return response;
    },

    delete: async function (collectionId) {
        const response = axiosClient
            .request({
                url: '/collection/delete',
                method: 'DELETE',
                params: { collectionId: collectionId },
            })
            .catch(function (error) {
                throw error;
            });

        return response;
    },
};
