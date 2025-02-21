import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/api";
import { useToast } from "./use-toast";

export type Container = {
	id: number;
	name: string;
	createdAt: string;
	weight: number;
};

export const useGetContainers = () => {
	return useQuery({
		queryKey: ["getContainers"],
		queryFn: api.containers.getContainers,
	});
};

export const useGetContainerById = (id: number) => {
	return useQuery({
		queryKey: ["getContainerById", id],
		queryFn: () => api.containers.getContainerById(id),
		enabled: !!id,
	});
};

export const useContainerToPort = (id: number) => {
	const queryClient = useQueryClient();
	const toast = useToast();
	return useMutation({
		mutationFn: (timestamp: Date) => api.containers.containerToPort(id, timestamp),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["getContainerById", id] });
			toast.toast({
				title: "Contenedor actualizado correctamente",
				description: "El contenedor ha sido actualizado correctamente",
			});
		},
		onError: () => {
			toast.toast({
				variant: "destructive",
				title: "Error al actualizar el contenedor",
				description: "El contenedor no se ha podido actualizar correctamente",
			});
		},
	});
};

export const useUpdateContainerStatus = (containerId: number) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: { timestamp: Date; statusId: number }) => {
			// Your API call here
			await api.containers.updateContainerShipmentsStatus(
				containerId,
				data.statusId,
				data.timestamp,
			);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["getContainerById", containerId] });
		},
	});
};
