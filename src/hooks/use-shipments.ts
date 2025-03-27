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

export const useGetShipmentsInInvoice = (hbl: string) => {

	return useQuery({
		queryKey: ["getShipmentsInInvoice", hbl],
		queryFn: () => api.shipments.getShipmentsInInvoice(hbl),
		
		
	});
};

export const useDeliveryShipments = () => {
	return useMutation({
		mutationFn: (shipments: { hbl: string; timestamp: string }[]) =>
			api.shipments.deliveryShipments(shipments),
		   
	});
};

