import { User } from "@/types/user";
import axios from "axios";

const baseUrl =
	process.env.NODE_ENV === "production"
		? "https://apiv1trackingctenvioscom.vercel.app/api/v1"
		: "http://localhost:3001/api/v1";

const axiosInstance = axios.create({
	baseURL: baseUrl,
	headers: {
		"Content-Type": "application/json",
	},
});

axiosInstance.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token"); // Or use a state management solution
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error),
);

const api = {
	users: {
		getUsers: async () => {
			const response = await axiosInstance.get("/users");
			return response.data;
		},
		getUser: async (userId: string) => {
			const response = await axiosInstance.get(`/users/${userId}`);
			return response.data;
		},
		deleteUser: async (userId: string) => {
			const response = await axiosInstance.delete(`/users/${userId}`);
			return response.data;
		},
		createUser: async (user: Omit<User, "id">) => {
			const response = await axiosInstance.post("/users/register", user);
			return response.data;
		},
		login: async (params: { email: string; password: string }) => {
			const response = await axiosInstance.post("/users/login", params);
			return response.data;
		},
		updateUser: async (userId: string, user: Partial<User>) => {
			console.log(user, "on APi");
			const response = await axiosInstance.put(`/users/${userId}`, user);
			return response.data;
		},
	},
	containers: {
		getContainers: async () => {
			const response = await axiosInstance.get("/containers");
			return response.data;
		},
	},
	shipments: {
		getAll: async () => {
			const response = await axiosInstance.get("/shipments");
			return response.data;
		},
		search: async (params: { query: string }) => {
			const response = await axiosInstance.get("/shipments/search", { params });
			return response.data;
		},
	},
};
export { api, baseUrl };
