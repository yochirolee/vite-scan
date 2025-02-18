import { api } from "@/api/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface Shipment {
	id: string;
	hbl: string;
	// ... add other shipment properties
}

export const useGetScannedShipments = (hbl: string) => {
	const queryClient = useQueryClient();
	const { data, isLoading, isError } = useQuery({
		queryKey: ["scanned-shipments", hbl],
		queryFn: () => api.shipments.scan(hbl),
		enabled: !!hbl,
		select: (data: Shipment) => {
			queryClient.setQueryData<Shipment[]>(["scanned-shipments"], (prevData) => {
				if (!prevData) return [data];
				// Prevent duplicate entries
				const exists = prevData.some((item) => item.hbl === data.hbl);
				if (exists) return prevData;
				return [...prevData, data];
			});
			console.log(data);
			return data;
		},
	});

	return {
		data,
		isLoading,
		isError,
	} as const;
};
