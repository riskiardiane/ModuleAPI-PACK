const axios = require('axios');
const BASE_URL = 'https://animkuapi.vercel.app';
const AnimkuApi = {
    async getHome() {
        try {
            const response = await axios.get(`${BASE_URL}/`);
            return response.data;
        } catch (error) {
            this._handleError('getHome', error);
        }
    },
    async getDetail(slug) {
        try {
            const response = await axios.get(`${BASE_URL}/anime/${slug}`);
            return response.data;
        } catch (error) {
            this._handleError('getDetail', error);
        }
    },
    async getWatch(slug) {
        try {
            const response = await axios.get(`${BASE_URL}/ntn/${slug}`);
            return response.data;
        } catch (error) {
            this._handleError('getWatch', error);
        }
    },
    async getGenre(slug, pageNumber = 1) {
        try {
            const response = await axios.get(`${BASE_URL}/genres/${slug}/page/${pageNumber}`);
            return response.data;
        } catch (error) {
            this._handleError('getGenre', error);
        }
    },
    async search(query, pageNumber = 1) {
        try {
            const response = await axios.get(`${BASE_URL}/search/${pageNumber}/${encodeURIComponent(query)}`);
            return response.data;
        } catch (error) {
            this._handleError('search', error);
        }
    },
    async getDirector(slug, pageNumber = 1) {
        try {
            const response = await axios.get(`${BASE_URL}/director/${slug}/page/${pageNumber}`);
            return response.data;
        } catch (error) {
            this._handleError('getDirector', error);
        }
    },
    async getProducer(slug, pageNumber = 1) {
        try {
            const response = await axios.get(`${BASE_URL}/producer/${slug}/page/${pageNumber}`);
            return response.data;
        } catch (error) {
            this._handleError('getProducer', error);
        }
    },
    async getStudio(slug, pageNumber = 1) {
        try {
            const response = await axios.get(`${BASE_URL}/studio/${slug}/page/${pageNumber}`);
            return response.data;
        } catch (error) {
            this._handleError('getStudio', error);
        }
    },
    async getSeason(slug) {
        try {
            const response = await axios.get(`${BASE_URL}/season/${slug}`);
            return response.data;
        } catch (error) {
            this._handleError('getSeason', error);
        }
    },
    async getCast(slug, pageNumber = 1) {
        try {
            const response = await axios.get(`${BASE_URL}/cast/${slug}/page/${pageNumber}`);
            return response.data;
        } catch (error) {
            this._handleError('getCast', error);
        }
    },
    _handleError(method, error) {
        console.error(`Error in AnimkuApi.${method}:`, error.message);
        throw {
            success: false,
            method: method,
            message: error.message,
            status: error.response ? error.response.status : null
        };
    }
};
module.exports = AnimkuApi;
