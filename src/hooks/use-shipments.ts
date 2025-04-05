import { api } from "@/api/api";
import { Shipment } from "@/types";
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

export const useScanShipment = () => {
	const location = useGeolocation();

	const queryClient = useQueryClient();
	const timestamp = new Date();

	return useMutation({
		mutationFn: ({ hbl, statusId }: { hbl: string; statusId: number }) =>
			api.shipments.scan(hbl, statusId, timestamp, location?.latitude, location?.longitude),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["scanned-shipments"] });
			toast.success("HBL escaneado correctamente", {
				description: "El HBL ha sido escaneado correctamente",
			});
		},
		onError: () => {
			toast.error("Error al escanear el HBL", {
				description: "Por favor, inténtelo de nuevo",
			});
		},
	});
};
export const useGetShipmentByHbl = (hbl: string) => {
	return useQuery({
		queryKey: ["getShipmentByHbl", hbl],
		queryFn: () => api.shipments.getShipmentByHbl(hbl),
		enabled: !!hbl,
	});
};

export const useGetAllShipmentsInInvoice = (hbl: string) => {
	const { data, isLoading, isError } = useQuery({
		queryKey: ["getShipmentsInInvoice", hbl],
		queryFn: () => api.shipments.getAllShipmentsInInvoice(hbl),
		enabled: !!hbl,
		retry: 0,
		staleTime: 1000 * 60 * 5,
		gcTime: 1000 * 60 * 10,
	});
	if (data) {
		const result = {
			...data,
			shipments: data?.shipments?.map((shipment: Shipment) =>
				shipment?.hbl === hbl
					? { ...shipment, isScanned: true, timestamp: new Date().toISOString() }
					: shipment,
			),
		};
		return { data: result, isLoading, isError };
	}
	return { data, isLoading, isError };
};

export const useDeliveryShipments = () => {
	return useMutation({
		mutationFn: (shipments: { hbl: string; timestamp: string }[]) =>
			api.shipments.deliveryShipments(shipments),
	});
};

export const useUpdateShipmentStatus = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			hbl,
			isScanned,
			timestamp,
		}: {
			hbl: string;
			isScanned: boolean;
			timestamp: string;
		}) => {
			// Here we're just updating the local state
			// You can add an API call if needed
			return Promise.resolve({ hbl, isScanned, timestamp });
		},
		onMutate: async ({ hbl, isScanned, timestamp }) => {
			console.log(hbl, isScanned, timestamp, "hbl, isScanned, timestamp");
			// Cancel outgoing refetches
			await queryClient.cancelQueries({ queryKey: ["getShipmentsInInvoice"] });

			// Update the cache
			queryClient.setQueriesData({ queryKey: ["getShipmentsInInvoice"] }, (old: any) => {
				if (!old) return old;
				return {
					...old,
					shipments: old.shipments.map((shipment: Shipment) =>
						shipment.hbl === hbl ? { ...shipment, isScanned, timestamp } : shipment,
					),
				};
			});
		},
	});
};
