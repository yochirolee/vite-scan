import { api } from "@/api/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useGeolocation } from "@uidotdev/usehooks";
import { toast } from "sonner";
import { useAuthContext } from "@/context/auth-context";
export const useGetScannedShipments = (statusId: number) => {
	const { user } = useAuthContext();
	console.log(user);
	return useQuery({
		queryKey: ["scanned-shipments", statusId, user?.userId],
		queryFn: () => api.shipments.scanned(statusId),
		enabled: !!statusId && !!user?.userId,
	});
};

export const useScanShipment = (hbl: string, statusId: number) => {
	const location = useGeolocation();

	location.error &&
		toast.error("Error al obtener la ubicación", {
			description: "Por favor, inténtelo de nuevo",
		});

	const queryClient = useQueryClient();
	const timestamp = new Date();
	if (location) {
		console.log(location, statusId, timestamp);
	}
	const { user } = useAuthContext();
	if (!user) {
		toast.error("No estás autenticado", {
			description: "Por favor, inicie sesión para escanear HBLs",
		});
		return;
	}
	return useMutation({
		mutationFn: () =>
			api.shipments.scan(hbl, statusId, timestamp, location?.latitude, location?.longitude),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["scanned-shipments", statusId, user?.userId] });
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
