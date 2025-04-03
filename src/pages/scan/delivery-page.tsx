import { useState } from "react";
import { AlertCircle, ScanBarcode } from "lucide-react";
import { HBLScanner } from "@/components/hbl-scanner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CameraScan } from "@/components/camera/camera-scan-input";
import {
	useDeliveryShipments,
	useGetAllShipmentsInInvoice,
	useUpdateShipmentStatus,
} from "@/hooks/use-shipments";
import { Loader } from "@/components/common/loader";
import { Form } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import ShipmentListView from "@/components/shipments/shipment-list-view";
import { useGeolocation } from "@uidotdev/usehooks";
import { useNavigate } from "react-router-dom";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";

const formSchema = z.object({
	parcels: z.array(
		z.object({
			hbl: z.string(),
			isScanned: z.boolean(),
			timestamp: z.string(),
			description: z.string().optional(),
		}),
	),
});
type Shipment = {
	hbl: string;
	invoiceId: number;
	agency: string;
	receiver: string;
	sender: string;
	isScanned: boolean;
	state: string;
	status: string;
	timestamp: string;
	description: string;
};

type DeliveryFormValues = z.infer<typeof formSchema>;

export default function DeliveryPage() {
	const [hbl, setHbl] = useState("");
	const { data: shipmentsInInvoice, isLoading, isError } = useGetAllShipmentsInInvoice(hbl);
	const mutation = useDeliveryShipments();
	const location = useGeolocation();
	const navigate = useNavigate();
	const updateStatus = useUpdateShipmentStatus();

	console.log(shipmentsInInvoice, "shipmentsInInvoice");

	const form = useForm<DeliveryFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			parcels: [],
		},
	});

	// Update shipments when shipmentsInInvoice changes, maintaining previous data

	const handleScan = (hbl: string) => {
		const hblNumber = hbl.startsWith("CTE") ? hbl : hbl.split(",")[1];
		const formattedHbl = hblNumber?.trim() ?? null;
		if (shipmentsInInvoice?.shipments.find((shipment: Shipment) => shipment.hbl === formattedHbl)) {
			updateStatus.mutate({
				hbl: formattedHbl,
				isScanned: true,
				timestamp: new Date().toISOString(),
			});
			return;
		}
		setHbl(formattedHbl);
	};

	const clearCache = () => {
		setHbl("");
		localStorage.removeItem("delivery-shipments");
		toast.success("Entrega Descartada");
		navigate("/delivery");
	};

	const onSubmit = () => {
		const shipmentsToSubmit = shipmentsInInvoice?.shipments
			?.filter((shipment: Shipment) => shipment.isScanned)
			.map(({ hbl, timestamp }: Shipment) => ({
				hbl: hbl ?? "",
				timestamp: timestamp ?? "",
				statusId: 10,
				longitude: location?.longitude ?? 0,
				latitude: location?.latitude ?? 0,
			}));

		if (!shipmentsToSubmit?.length) {
			toast.error("No shipments selected for delivery");
			return;
		}

		mutation.mutate(shipmentsToSubmit, {
			onSuccess: (data) => {
				toast.success("Shipments delivered successfully");
				const eventsId = data.map((item: any) => item.id);
				navigate("/delivery/photos", { state: { eventsId } });
			},
			onError: (error) => {
				toast.error(error instanceof Error ? error.message : "Failed to deliver shipments");
			},
		});
	};

	const [isCameraOpen, setIsCameraOpen] = useState(false);
	return (
		<div className="relative  m-2  h-[90vh]">
			<div className="absolute z-10 top-0 right-2">
				<Button variant="ghost" onClick={() => setIsCameraOpen(!isCameraOpen)}>
					<ScanBarcode className="w-4 h-4" />
				</Button>
			</div>
			{isCameraOpen ? (
				<CameraScan onScan={handleScan} isLoading={false} />
			) : (
				<HBLScanner handleScan={handleScan} />
			)}
			<div className="container mx-auto p-2 rounded-lg ">
				<Card className=" gap-2 mt-2">
					<CardHeader className="flex m-0 pt-2 pb-0 flex-col gap-2">
						<CardTitle className="flex flex-col gap-2">
							<span className="text-sm font-medium">{shipmentsInInvoice?.receiver?.name}</span>
							<span className="text-sm font-medium">{shipmentsInInvoice?.receiver?.ci}</span>
						</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-col gap-2">
						<div className="flex flex-col gap-2">
							<span className="text-xs text-gray-500">{shipmentsInInvoice?.receiver?.address}</span>
							<span className="text-xs text-gray-500">{shipmentsInInvoice?.receiver?.mobile}</span>

							<div className="flex gap-2">
								<span className="text-xs text-gray-500">{shipmentsInInvoice?.receiver?.state}</span>
								<span className="text-xs text-gray-500">{shipmentsInInvoice?.receiver?.city}</span>
							</div>
						</div>
					</CardContent>
					

					{shipmentsInInvoice?.shipments?.length > 0 && (
						<Badge variant="outline">
							{
								shipmentsInInvoice?.shipments?.filter((shipment: Shipment) => shipment.isScanned)
									.length
							}
							/{shipmentsInInvoice?.shipments?.length}
						</Badge>
					)}

					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<div className=" flex m-1 p-2 justify-center items-center ">
								<Button
									className="w-full"
									disabled={shipmentsInInvoice?.shipments?.length === 0}
									type="submit"
								>
									{mutation.isPending ? "Guardando..." : "Continuar"}
								</Button>
							</div>
						</form>
					</Form>
				</Card>
				<div className="flex mt-4 flex-col gap-2">
					<ScrollArea className=" h-[50vh]">
						{isLoading && (
							<div className="flex items-center justify-center h-full">
								<Loader />
							</div>
						)}
						{isError && (
							<div className="flex items-center justify-center h-full">
								<AlertCircle className="w-4 h-4 text-red-500" />
							</div>
						)}
						<ShipmentListView shipments={shipmentsInInvoice?.shipments || []} />
					</ScrollArea>
				</div>
			</div>
		</div>
	);
}
