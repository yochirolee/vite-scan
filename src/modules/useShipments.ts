import { api } from "@/api/api";
import { ShipmentsInterface } from "@/api/api";
import { useMutation } from "@tanstack/react-query";

export const useUpsertShipment = () => {
	const mutation = useMutation({
		mutationFn: (shipments: ShipmentsInterface) => api.shipments.upsert(shipments),
	});
	return mutation;
};
