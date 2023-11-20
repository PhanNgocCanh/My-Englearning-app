import axiosClient from './AxiosClient';

export const LoginAPI = {
    authenticate: async function (body) {
        const response = await axiosClient
            .request({
                url: '/login',
                method: 'POST',
                data: {
                    username: body.username,
                    password: body.password,
                },
            })
            .catch(function (error) {
                throw error;
            });

        return response;
    },

    register: async function (body) {
        const response = await axiosClient
            .request({
                url: 'register',
                method: 'POST',
                data: body,
            })
            .catch(function (error) {
                throw error;
            });
        return response;
    },

    logout: async function () {
        const response = await axiosClient
            .request({
                url: 'logout',
                method: 'GET',
            })
            .catch(function (error) {
                throw error;
            });
        return response;
    },
};
