import { api } from "@/api/api";
import { tracking_api } from "@/api/tracking-api";
import { useQuery } from "@tanstack/react-query";

export const useFetchContainers = () => {
	return useQuery<any[], Error>({
		queryKey: ["containers"],
		queryFn: api.containers.getContainers,
	});
};
/* type GetParcelsByContainerToUngroup = {
	hbl: string;
	invoiceId: number;
	description: string;
}; */
export const useGetParcelsByContainerToUngroup = (containerId: number) => {
	return useQuery<any[], Error>({
		queryKey: ["parcelsByContainerToUngroup", containerId],
		queryFn: () => tracking_api.containers.getParcelsByContainerToUngroup(containerId),
	});
};

export const useFetchParcelsByContainerId = (containerId: number | null) => {
	return useQuery({
		queryKey: ["parcelsByContainerId", containerId],
		queryFn: () => tracking_api.containers.fetchParcelsByContainerId(containerId!),
		enabled: !!containerId,
	});
};
