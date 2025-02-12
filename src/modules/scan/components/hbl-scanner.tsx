import { useState } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
/* import { tracking_api } from "@/api/tracking-api";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
 */
interface HBLScannerProps {
	handleScan: (hbl: string) => void;
}

export function HBLScanner({ handleScan }: HBLScannerProps) {
	const [scanValue, setScanValue] = useState("");
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
	}) */ const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const hblNumber = scanValue.startsWith("CTE") ? scanValue : scanValue.split(",")[1];
		if (!hblNumber) {
			toast.error("Invalid scan value - no HBL number found");
			setScanValue("");
			return;
		}
		// Update scanValue to just use the HBL number
		setScanValue(hblNumber);
		/* eventMutation.mutate({
			hbl: scanValue.trim(),
			locationId: 5,
			statusId: 5,
			updatedAt: new Date().toISOString(),
		}); */
		handleScan(hblNumber.trim());
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
