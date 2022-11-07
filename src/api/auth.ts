import service from '@/utils/request'

export const useCaptchaApi = () => {
	return service.get('/auth/captcha')
}

export const useSendCodeApi = (mobile: string) => {
	return service.post('/auth/send/code?mobile=' + mobile)
}

export const useAccountLoginApi = (data: any) => {
	return service.post('/auth/login', data)
}

export const useMobileLoginApi = (data: any) => {
	return service.post('/auth/mobile', data)
}

export const useLogoutApi = () => {
	return service.post('/auth/logout')
}
