import { messages } from './../i18n/index'
import axios from 'axios'
import qs from 'qs'
import { ElMessage } from 'element-plus'
import store from '@/store'
import cache from '@/utils/cache'

// axios实例
const service = axios.create({
	baseURL: import.meta.env.VITE_API_URL as any,
	timeout: 60000,
	headers: { 'Content-Type': 'application/json;charset=UTF-8' }
})

// request interceptor
service.interceptors.request.use(
	(config: any) => {
		const userStore = store.userStore
		if (userStore?.token) {
			config.headers.Authorization = userStore.token
		}

		config.headers['Accept-Language'] = cache.getLanguage()

		// Append timestamp to prevent GET requests from being cached
		if (config.method?.toUpperCase() === 'GET') {
			config.params = { ...config.params, t: new Date().getTime() }
		}

		if (Object.values(config.headers).includes('application/x-www-form-urlencoded')) {
			config.data = qs.stringify(config.data)
		}

		return config
	},
	error => {
		return Promise.reject(error)
	}
)

// response interceptor
service.interceptors.response.use(
	response => {
		if (response.status !== 200) {
			return Promise.reject(new Error(response.data.message || 'Server Error'))
		}

		const res = response.data
		if (response.status == 200) {
			return res
		}

		// No permission, such as: not logged in, login expired, etc., you need to jump to the login page
		if (res.code === 401) {
			store.userStore?.setToken('')
			location.reload()
		}

		return Promise.reject(new Error(response.data.message || 'Error'))
	},
	error => {
		ElMessage.error(error.response.data.message)
		return Promise.reject(error)
	}
)

// 导出 axios 实例
export default service
