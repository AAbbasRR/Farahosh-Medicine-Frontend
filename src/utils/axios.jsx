import axios from "axios";
import useAuthStore from "src/store";
import "./style.css";

const instance = axios.create({
	baseURL: `${process.env.REACT_APP_BACK_URL}/api/v1`,
});

instance.interceptors.request.use(async (config) => {
	const accessToken = useAuthStore.getState().accessToken;

	if (accessToken !== null) {
		config.headers.Authorization = `Bearer ${accessToken}`;
	}
	return config;
});

instance.interceptors.response.use(
	(res) => {
		return res;
	},
	(error) => {
		const logout = useAuthStore.getState().logout;
		if (error?.response?.status === 401) {
			logout();
			window.location.href = "/signin";
			return;
		}

		return Promise.reject(error);
	},
);

export default instance;
