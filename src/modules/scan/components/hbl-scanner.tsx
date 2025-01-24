import { useState } from "react";
import { Input } from "@/components/ui/input";

interface HBLScannerProps {
	onScan: (value: string) => void;
}
/* type CreateEventMutation = {
	hbl: string;
	locationId: number;
	statusId: number;
	updatedAt: string;
}; */
export function HBLScanner({ onScan }: HBLScannerProps) {
	const [scanValue, setScanValue] = useState("");
/* 	const queryClient = useQueryClient();
 */
/* 	const eventMutation = useMutation({
		mutationFn: (values: CreateEventMutation) => tracking_api.events.create(values),
		onSuccess: () => {
			setScanValue("");
			queryClient.invalidateQueries({
				queryKey: ["parcelsByContainerId"],
			});
			onScan(scanValue);
		},
		onError: (error) => {
			console.error("Error creating Event:", error);
		},
	}); */

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log(scanValue);
		/* eventMutation.mutate({
			hbl: scanValue,
			locationId: 5,
			statusId: 5,
			updatedAt: new Date().toISOString(),
		}); */

		onScan(scanValue.trim());
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
