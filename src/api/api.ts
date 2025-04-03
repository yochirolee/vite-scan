import { User } from "@/types/user";
import axios from "axios";
import { createOfflineQueue } from "@/lib/offline-queue";
import { infiniteQueryOptions } from "@tanstack/react-query";

export interface ShipmentsInterface {
	hbls: string[];
	statusId: number;
	timestamp: string;
}
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

const offlineQueue = createOfflineQueue();

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
		getContainerById: async (containerId: number) => {
			const response = await axiosInstance.get(`/containers/${containerId}/shipments`);
			return response.data;
		},
		containerToPort: async (containerId: number, timestamp: Date) => {
			const response = await axiosInstance.post(`/containers/toPort/${containerId}`, {
				timestamp,
			});
			return response.data;
		},
		updateContainerShipmentsStatus: async (
			containerId: number,
			statusId: number,
			timestamp: Date,
		) => {
			const response = await axiosInstance.put(`/containers/update/${containerId}/shipments`, {
				timestamp,
				statusId,
			});
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
		getShipmentByHbl: async (hbl: string) => {
			const response = await axiosInstance.get(`/shipments/hbl/${hbl}`);
			return response.data;
		},

		/* // Get all shipments in an invoice once a hbl is scanned
		getShipmentsInInvoice: async (hbl: string) => {
			const STORAGE_KEY = "delivery-shipments";
			const storedData = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as Array<{
				hbl: string;
				timestamp: string;
				isScanned?: boolean;
			}>;

			// First check if we have any stored data
			if (storedData.length === 0 && hbl?.length > 6) {
				// Only fetch from API if no stored data exists
				const response = await axiosInstance.get(`/shipments/delivery/${hbl}`);
				if (response.data.length > 0) {
					const updatedData = response.data.map((shipment: any) => ({
						...shipment,
						isScanned: shipment.hbl === hbl,
						timestamp: shipment.hbl === hbl ? new Date().toISOString() : shipment.timestamp,
					}));
					localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
					return updatedData;
				}
				return [];
			}

			// If we have stored data, just update the existing shipment if found
			const existingShipmentIndex = storedData.findIndex((shipment) => shipment.hbl === hbl);
			if (existingShipmentIndex !== -1) {
				storedData[existingShipmentIndex].isScanned = true;
				storedData[existingShipmentIndex].timestamp = new Date().toISOString();
				localStorage.setItem(STORAGE_KEY, JSON.stringify(storedData));
			}

			return storedData;
		}, */
		getAllShipmentsInInvoice: async (hbl: string) => {
			const response = await axiosInstance.get(`/shipments/delivery/${hbl}`);
			return response.data;
		},

		deliveryShipments: async (shipments: { hbl: string; timestamp: string }[]) => {
			const response = await axiosInstance.post("/shipments/delivery", { shipments });
			return response.data;
		},

		uploadImage: async (data: FormData, eventsId: string[]) => {
			console.log(data, "data to submit on api");
			const response = await axiosInstance.post("/images/upload-images", data, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			if (response.status === 200) {
				await axiosInstance.post("/images/insert", {
					eventsId,
					image: response.data.url,
				});
				return response.data;
			}
			return response.data;
		},

		scanned: async (statusId: number) => {
			const response = await axiosInstance.get(`/shipments/scanned/${statusId}`);
			return response.data;
		},
		scan: async (
			hbl: string,
			statusId: number,
			timestamp: Date,
			lat: number | null,
			loc: number | null,
		) => {
			try {
				const response = await axiosInstance.post(`/shipments/scan`, {
					hbl,
					statusId,
					timestamp,
					lat,
					loc,
				});
				return response.data;
			} catch (error) {
				if (!navigator.onLine) {
					// Queue for later sync
					offlineQueue.add({
						type: "scan",
						service: "shipments",
						data: { hbl, statusId, timestamp, lat, loc },
						timestamp: new Date().toISOString(),
					});
					//	 Return optimistic response
					return { success: true, offline: true };
				}
				throw error;
			}
		},
	},
};
export { api, baseUrl };
