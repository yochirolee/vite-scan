import { tracking_api } from "@/api/tracking-api";
import { useQuery } from "@tanstack/react-query";

export const useFetchContainers = () => {
	return useQuery<any[], Error>({
		queryKey: ["containers"],
		queryFn: tracking_api.containers.fetchContainers,
	});
};

export const useFetchParcelsByContainerId = (containerId: number | null) => {
	return useQuery<any[], Error>({
		queryKey: ["parcelsByContainerId", containerId],
		queryFn: () => tracking_api.containers.fetchParcelsByContainerId(containerId!),
		enabled: !!containerId,
	});
};
