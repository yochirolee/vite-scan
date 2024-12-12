import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

export const baseUrl =
	process.env.NODE_ENV === "production"
		? "https://apiv1trackingctenvioscom.vercel.app/api"
		: "http://localhost:3001/api";

interface UserInterface {
	userId: string;
	email: string;
	password: string;
	name: string;
	agencyId: number;
	roleId: number;
	role: string;
	token?: string;
	newPassword?: string;
}

// Login mutation
export const useLoginMutation = () => {
	return useMutation<any, Error, Pick<UserInterface, "email" | "password">>({
		mutationFn: async ({ email, password }) => {
			const response = await axios.post(`${baseUrl}/users/login`, { email, password });
			return response.data;
		},
	});
};

// Register mutation
export const useRegisterMutation = () => {
	return useMutation<
		any,
		Error,
		Pick<UserInterface, "email" | "password" | "name" | "agencyId" | "roleId">
	>({
		mutationFn: async ({ email, password, name, agencyId, roleId }) => {
			const response = await axios.post(`${baseUrl}/users/register`, {
				email,
				password,
				name,
				agencyId,
				roleId,
			});
			return response.data;
		},
	});
};

// Logout mutation
export const useLogoutMutation = () => {
	return useMutation<any, Error, void>({
		mutationFn: () => authApi.logout(),
	});
};

// Refresh token mutation
export const useRefreshTokenMutation = () => {
	return useMutation<any, Error, void>({
		mutationFn: () => authApi.refreshToken(),
	});
};

// Forgot password mutation
export const useForgotPasswordMutation = () => {
	return useMutation<any, Error, Pick<UserInterface, "email">>({
		mutationFn: ({ email }) => authApi.forgotPassword(email),
	});
};

// Reset password mutation
export const useResetPasswordMutation = () => {
	return useMutation<any, Error, { token: string; newPassword: string }>({
		mutationFn: ({ token, newPassword }) => authApi.resetPassword(token, newPassword),
	});
};

// Example of a query (if needed for any GET requests)
export const useGetUser = (userId: string) => {
	return useQuery({
		queryKey: ["user", userId],
		queryFn: () => authApi.getUser(userId),
		enabled: !!userId,
	});
};
// Query to get all users
export const useGetAllUsers = () => {
	return useQuery({
		queryKey: ["allUsers"],
		queryFn: () => authApi.getAllUsers(),
	});
};

// Delete user mutation
export const useDeleteUserMutation = () => {
	return useMutation<any, Error, Pick<UserInterface, "userId">>({
		mutationFn: ({ userId }) => authApi.deleteUser(userId),
	});
};

const authApi = {
	login: async (email: string, password: string) => {
		try {
			localStorage.removeItem("token");
			const response = await axios.post(`${baseUrl}/users/login`, { email, password });

			return response.data;
		} catch (error) {
			throw error;
		}
	},

	register: async (
		email: string,
		password: string,
		name: string,
		agencyId: number,
		role: string,
	) => {
		try {
			const response = await axios.post(`${baseUrl}/users/register`, {
				email,
				password,
				name,
				agencyId,
				role,
			});
			return response.data;
		} catch (error) {
			throw error;
		}
	},

	logout: async () => {
		try {
			const response = await axios.post(`${baseUrl}/logout`);
			return response.data;
		} catch (error) {
			throw error;
		}
	},

	refreshToken: async () => {
		try {
			const response = await axios.post(`${baseUrl}/refresh-token`);
			return response.data;
		} catch (error) {
			throw error;
		}
	},

	forgotPassword: async (email: string) => {
		try {
			const response = await axios.post(`${baseUrl}/forgot-password`, { email });
			return response.data;
		} catch (error) {
			throw error;
		}
	},

	resetPassword: async (token: string, newPassword: string) => {
		try {
			const response = await axios.post(`${baseUrl}/reset-password`, { token, newPassword });
			return response.data;
		} catch (error) {
			throw error;
		}
	},

	getUser: async (userId: string) => {
		try {
			const response = await axios.get(`${baseUrl}/users/${userId}`);
			return response.data;
		} catch (error) {
			throw error;
		}
	},
	getAllUsers: async () => {
		try {
			const response = await axios.get(`${baseUrl}/users`);
			return response.data;
		} catch (error) {
			throw error;
		}
	},
	deleteUser: async (userId: string) => {
		try {
			const response = await axios.delete(`${baseUrl}/users/${userId}`);
			return response.data;
		} catch (error) {
			throw error;
		}
	},
};

export default authApi;
