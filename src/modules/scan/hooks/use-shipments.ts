import { api } from "@/api/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useGeolocation } from "@uidotdev/usehooks";
import { toast } from "sonner";
export const useGetScannedShipments = (statusId: number) => {
	return useQuery({
		queryKey: ["scanned-shipments", statusId],
		queryFn: () => api.shipments.scanned(statusId),
		enabled: !!statusId,
	});
};

export const useScanShipment = (hbl: string, statusId: number) => {
	const location = useGeolocation();

	const queryClient = useQueryClient();
	const timestamp = new Date();
	if (location) {
		console.log(location, statusId, timestamp);
	}
	return useMutation({
		mutationFn: () =>
			api.shipments.scan(
				hbl,
				statusId,
				timestamp,
				location?.latitude,
				location?.longitude,
			),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["scanned-shipments"] });
		},
		onError: () => {
			toast.error("Error al escanear el HBL", {
				description: "Por favor, inténtelo de nuevo",
			});
		},
	});
};
