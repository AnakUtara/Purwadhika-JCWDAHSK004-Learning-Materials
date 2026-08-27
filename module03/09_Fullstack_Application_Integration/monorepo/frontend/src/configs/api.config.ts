import axios, { type AxiosInstance, type CreateAxiosDefaults } from "axios";

let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
	accessToken = token;
};

const defaultAxiosConfig: CreateAxiosDefaults = {
	baseURL: `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api`,
	withCredentials: true, // menerima jabatan tangan cors dari server. Dengan ini cookie bisa diterima di browser
	timeout: 15000, // 15s
	headers: {
		"Content-Type": "application/json",
	},
};

export const apiStatic = axios.create(defaultAxiosConfig);

const apiAuth = () => {
	const instance: AxiosInstance = axios.create(defaultAxiosConfig);

	instance.interceptors.request.use((config) => {
		if (accessToken) {
			config.headers.Authorization = `Bearer ${accessToken}`;
		}
		return config;
	});

	return instance;
};

export default apiAuth;
