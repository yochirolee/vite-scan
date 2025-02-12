import axios from "axios";
const baseUrl =
	process.env.NODE_ENV === "production"
		? "https://apiv1trackingctenvioscom.vercel.app/api/v1"
		: "http://localhost:3001/api/v1";

export const tracking_api = {
	/* parcels: {
		getAll: async (): Promise<ParcelInterface[]> => {
			const response = await axios.get(`${baseUrl}/parcels`);
			return response.data;
		},

		search: async (searchQuery: string): Promise<ParcelInterface[]> => {
			const response = await axios.get(`${baseUrl}/parcels/search`, {
				params: { q: searchQuery },
			});

			return response.data;
		},

		getByHbl: async (hbl: string): Promise<any[]> => {
			const response = await axios.get(`${baseUrl}/parcels/hbl/${hbl}`);
			return response.data;
		},
		importExcelEvents: async (file: File): Promise<any[]> => {
			const formData = new FormData();
			formData.append("file", file);
			const response = await axios.post(`${baseUrl}/parcels/import-events`, formData);
			return response.data;
		},
	}, */

	containers: {
		fetchContainers: async (): Promise<any[]> => {
			const response = await axios.get(`${baseUrl}/containers`);
			return response.data;
		},
		getParcelsByContainerToUngroup: async (containerId: number) => {
			const response = await axios.get(`${baseUrl}/containers/${containerId}`);
			return response.data;
		},

		fetchParcelsByContainerId: async (containerId: number) => {
			const response = await axios.get(`${baseUrl}/containers/${containerId}/parcels`);
			return response.data;
		},
		containerUpdate: async (values: any): Promise<any[]> => {
			const response = await axios.post(`${baseUrl}/containers/updateStatus`, values);
			return response.data;
		},
	},
	events: {
		create: async (values: any): Promise<any[]> => {
			const response = await axios.post(`${baseUrl}/parcels/create-event`, values);
			return response.data;
		},
	},
	issues: {
		getAll: async (): Promise<any[]> => {
			const response = await axios.get(`${baseUrl}/issues`);
			return response.data;
		},
	},
	stats: {
		getStats: async (): Promise<any[]> => {
			const response = await axios.get(`${baseUrl}/stats`);
			return response.data;
		},
		getDailySales: async (): Promise<any[]> => {
			const response = await axios.get(`${baseUrl}/stats/daily-sales`);
			return response.data;
		},
		getEmployeesSales: async (): Promise<any[]> => {
			const response = await axios.get(`${baseUrl}/stats/employees-sales`);
			return response.data;
		},
	},
};
