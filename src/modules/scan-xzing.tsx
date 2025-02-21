import { useState } from "react";
import { CameraScan } from "./components/camera-scan-input";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useParams } from "react-router-dom";
import { CameraIcon, ChevronRight, Loader2, Save } from "lucide-react";
import { statuses } from "@/data/data";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Stats } from "./scan/components/stats";
import { toast } from "sonner";
import { useGetScannedShipments, useScanShipment } from "./scan/hooks/use-shipments";
/* const formSchema = z.object({
	hbls: z.array(z.string()),
	statusId: z.number(),
	timestamp: z.string(),
}); */

/* type FormSchema = z.infer<typeof formSchema>;
 */

interface Shipment {
	hbl: string;
	timestamp?: string;
	scanned?: boolean;
	invoiceId?: string;
	agency?: {
		name: string;
	};
	description?: string;
}

export const ScanXzing = () => {
	const [cameraMode, setCameraMode] = useState(false);
	const [hbl, setHbl] = useState("");
	const { id } = useParams();
	/* const [isLoading, setIsLoading] = useState(false);
	const [shipments, setShipments] = useState<Shipment[]>([]);
	 */ const { data: scannedShipments, isLoading: isLoadingScannedShipments } = useGetScannedShipments(
		parseInt(id || "0"),
	);
	/* const { data: shipments, isLoading, isError } = useGetScannedShipments(hbl);

	console.log(shipments); */

	/* const form = useForm<FormSchema>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			hbls: [],
			statusId: parseInt(id || "0"),
			timestamp: undefined,
		},
	});
 */
	/* 	const handleScan = async (value: string): Promise<void> => {
		setIsLoading(true);
		const hblNumber = value.startsWith("CTE") ? value : value.split(",")[1];
		const formattedHbl = hblNumber?.trim().toUpperCase() ?? "";
		toast("HBL escaneado correctamente");

		// Check if shipment already exists and update timestamp
		const existingShipmentIndex = shipments.findIndex((shipment) => shipment.hbl === formattedHbl);

		if (existingShipmentIndex !== -1) {
			const updatedShipments = [...shipments];
			updatedShipments[existingShipmentIndex] = {
				...shipments[existingShipmentIndex],
				timestamp: new Date().toISOString(),
				scanned: true,
			};
			setShipments(sortShipmentsByTimestamp(updatedShipments));
			setIsLoading(false);
			return;
		}

		const token = localStorage.getItem("token");
		try {
			const response = await axios.get<Shipment[]>(`${baseUrl}/shipments/scan/${formattedHbl}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			console.log(response.data);

			//if error, show toast
			if (response.status !== 200) {
				toast.error("Error al escanear el HBL");
				setIsLoading(false);
				return;
			}

			const newShipments = response.data.map((shipment) =>
				shipment.hbl === formattedHbl
					? { ...shipment, timestamp: new Date().toISOString(), scanned: true }
					: shipment,
			);

			setShipments((prev) => sortShipmentsByTimestamp([...prev, ...newShipments]));
			setIsLoading(false);
		} catch (error) {
			console.log(error);
			toast.error("Error al escanear el HBL");
			setIsLoading(false);
		}
	};

	const sortShipmentsByTimestamp = (shipments: Shipment[]): Shipment[] => {
		return [...shipments].sort((a, b) => {
			const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
			const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
			return timeB - timeA;
		});
	}; */

	const { mutate: scanShipment, isPending: isLoadingScanShipment } = useScanShipment(hbl);

	const handleScan = (value: string) => {
		const hblNumber = value.startsWith("CTE") ? value : value.split(",")[1];
		const formattedHbl = hblNumber?.trim().toUpperCase() ?? "";
		setHbl(formattedHbl);
		//if hbl exist on scannedShipments, show toast
		if (scannedShipments?.some((shipment: Shipment) => shipment.hbl === formattedHbl)) {
			toast.error("HBL ya escaneado");
			return;
		}
		scanShipment();
	};
	return (
		<div className="relative px-4 flex flex-col h-dvh">
			<div className="sticky  top-0 space-y-2">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<h1 className=" font-bold">
							{statuses.find((status) => status.id === parseInt(id || "0"))?.name}
						</h1>
					</div>
					<div className="flex items-center justify-end  space-x-2">
						<CameraIcon className={cameraMode ? "w-4 h-4" : "w-4 h-4 text-gray-400"} />
						<Switch id="camera-mode" checked={cameraMode} onCheckedChange={setCameraMode} />
					</div>
				</div>
				{cameraMode ? (
					<CameraScan isLoading={isLoadingScanShipment} onScan={handleScan} />
				) : (
					<HblScanner handleScan={handleScan} />
				)}
				{isLoadingScanShipment && (
					<div className="absolute inset-0 flex items-center justify-center">
						<Loader2 className="w-4 h-4 animate-spin" />
					</div>
				)}
				<Stats parcels={scannedShipments || []} />
			</div>

			<ScrollArea className="flex flex-col p-2 space-y-1 flex-1 min-h-0 h-full">
				{isLoadingScannedShipments && (
					<div className="absolute inset-0 flex items-center justify-center">
						<Loader2 className="w-4 h-4 animate-spin" />
					</div>
				)}
				{scannedShipments?.map((shipment: Shipment, index: number) => (
					<Card
						className={`flex items-center m-2 justify-between text-xs p-2 ${
							shipment?.timestamp ? "bg-green-500/30" : "bg-muted/20 text-muted-foreground"
						}`}
						key={index}
					>
						<div className="flex flex-col gap-2">
							<div>
								<span>{shipment?.hbl} </span>
								{shipment?.invoiceId}
							</div>

							<div>{shipment?.agency?.name}</div>
							<div>{shipment?.description}</div>
						</div>
						<div className="flex items-center gap-1">
							<div className="flex flex-col gap-2 justify-end">
								{/* <div className="text-xs text-gray-500">
									{shipment?.state}/{shipment?.city}
								</div> */}
								<div className="text-xs justify-end text-green-600">
									{shipment?.timestamp ? formatDate(shipment.timestamp) : ""}
								</div>
							</div>
							<Button variant="ghost" size="icon">
								<ChevronRight className="w-4 h-4" />
							</Button>
						</div>
					</Card>
				))}
			</ScrollArea>

			<div className="sticky bottom-0 p-4 bg-background border-t">
				<Button className="w-full" variant="outline" onClick={() => {}}>
					<Save className="w-4 h-4 mr-2" />
					Save
				</Button>
			</div>
		</div>
	);
};

const HblScanner = ({ handleScan }: { handleScan: (hbl: string) => void }) => {
	const [scanValue, setScanValue] = useState("");
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		handleScan(scanValue);
		setScanValue("");
	};
	return (
		<form onSubmit={handleSubmit} className="flex gap-2 ">
			<Input
				placeholder="Escanear HBL..."
				value={scanValue}
				onChange={(e) => setScanValue(e.target.value)}
				className="flex-1"
				autoFocus
			/>
		</form>
	);
};

const formatDate = (dateString: string): string => {
	const date = new Date(dateString);
	const day = date.getDate().toString().padStart(2, "0");
	const month = (date.getMonth() + 1).toString().padStart(2, "0");
	const year = date.getFullYear();
	const hours = date.getHours().toString().padStart(2, "0");
	const minutes = date.getMinutes().toString().padStart(2, "0");

	return `${day}/${month}/${year} ${hours}:${minutes}`;
};
