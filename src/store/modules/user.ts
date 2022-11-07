import { defineStore } from 'pinia'
import { useAccountLoginApi, useMobileLoginApi, useLogoutApi } from '@/api/auth'
import { useUserInfoApi } from '@/api/sys/user'
import cache from '@/utils/cache'
import { useAuthorityListApi } from '@/api/sys/menu'

export const userStore = defineStore('userStore', {
	state: () => ({
		// User Info
		user: {
			id: '',
			email: '',
			avatar: ''
		},
		// list of permissions
		authorityList: [],
		// login token
		token: cache.getToken()
	}),
	actions: {
		setUser(val: any) {
			console.log('aaaaaaaaaaaaa', val)
			this.user = val
		},
		setToken(val: any) {
			this.token = val
			cache.setToken(val)
		},
		// 账号登录
		async accountLoginAction(loginForm: any) {
			const data = await useAccountLoginApi(loginForm)

			console.log('data', data)
			this.setToken(data.token.accessToken)
			this.setUser(data.user)
		},
		// 手机号登录
		async mobileLoginAction(loginForm: any) {
			const { data } = await useMobileLoginApi(loginForm)
			this.setToken(data.access_token)
		},
		// 获取用户信息
		async getUserInfoAction() {
			// const { data } = await useUserInfoApi()
			// this.setUser(data)
		},
		// 获取权限
		async getAuthorityListAction() {
			// const { data } = await useAuthorityListApi()
			// this.authorityList = data || []
		},
		// 用户退出
		async logoutAction() {
			// await useLogoutApi()

			// 移除 token
			this.setToken(null)
		}
	}
})
