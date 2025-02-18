import { api } from "@/api/api";
import { ShipmentInterface } from "@/api/api";
import { useMutation } from "@tanstack/react-query";

export const useUpsertShipment = () => {
	const mutation = useMutation({
		mutationFn: (shipments: ShipmentInterface[]) => api.shipments.upsert(shipments),
	});
	return mutation;
};
