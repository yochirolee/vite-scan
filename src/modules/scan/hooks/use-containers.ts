import { tracking_api } from "@/api/tracking-api";
import { useQuery } from "@tanstack/react-query";

export const useFetchContainers = () => {
	return useQuery<any[], Error>({
		queryKey: ["containers"],
		queryFn: tracking_api.containers.fetchContainers,
	});
};

export const useFetchParcelsByContainerId = (containerId: number | null) => {
	const { data, isLoading, isError } = useQuery({
		queryKey: ["parcelsByContainerId", containerId],
		queryFn: () => tracking_api.containers.fetchParcelsByContainerId(containerId!),
		enabled: !!containerId,
	});
	return { data: data?.data, isLoading, isError };
};
