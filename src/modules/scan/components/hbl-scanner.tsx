import { useState } from "react";
import { Input } from "@/components/ui/input";
import { tracking_api } from "@/api/tracking-api";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

interface HBLScannerProps {
	onScan: (value: string) => void;
}
type CreateEventMutation = {
	hbl: string;
	locationId: number;
	statusId: number;
	updatedAt: string;
};
export function HBLScanner({ handleScan }: HBLScannerProps) {
	const [scanValue, setScanValue] = useState("");
	const queryClient = useQueryClient();
	const eventMutation = useMutation({
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
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log(scanValue);
		/* eventMutation.mutate({
			hbl: scanValue.trim(),
			locationId: 5,
			statusId: 5,
			updatedAt: new Date().toISOString(),
		}); */
		handleScan(scanValue.trim());
		setScanValue(""); // Clear input after scan
	};

	return (
		<form onSubmit={handleSubmit} className="flex gap-2 px-2">
			<Input
				placeholder="Escanear HBL..."
				value={scanValue}
				onChange={(e) => setScanValue(e.target.value)}
				className="flex-1"
				autoFocus
			/>
		</form>
	);
}
