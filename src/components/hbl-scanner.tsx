import { useRef } from "react";
import { Input } from "@/components/ui/input";
/* import { tracking_api } from "@/api/tracking-api";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
 */
interface HBLScannerProps {
	handleScan: (hbl: string) => void;
}

export function HBLScanner({ handleScan }: HBLScannerProps) {
	const inputRef = useRef<HTMLInputElement>(null);

	/* 	const eventMutation = useMutation({
	const queryClient = useQueryClient();
		mutationFn: (values: CreateEventMutation) => tracking_api.events.create(values),
		onSuccess: () => {
			setScanValue("");
			queryClient.invalidateQueries({
				queryKey: ["parcelsByContainerId"],
			});
		},
		onError: (error) => {
			console.error("Error creating Event:", error);
		},
	}) */
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (inputRef.current) {
			handleScan(inputRef.current.value);
			inputRef.current.value = "";
		}
	};

	return (
		<form onSubmit={handleSubmit} className="flex gap-2 px-2">
			<Input type="text" ref={inputRef} placeholder="Teclee HBL o factura..." className="flex-1" autoFocus />
		</form>
	);
}
