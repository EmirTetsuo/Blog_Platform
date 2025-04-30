import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL;
const instance = axios.create({
    baseURL: `${API_URL}/api`,
    validateStatus: () => true,
})

instance.interceptors.request.use((config) => {
    config.headers.Authorization = window.localStorage.getItem('token')

    return config
})

export default instance
