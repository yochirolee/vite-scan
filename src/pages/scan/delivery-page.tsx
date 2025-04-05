import { useState } from "react";
import { AlertCircle, ScanBarcode, ChevronDown, ChevronUp, File } from "lucide-react";
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
import { formatDate } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import NoShipments from "@/components/no-shipments";

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

	const form = useForm<DeliveryFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			parcels: [],
		},
	});

	const markShipmentAsScanned = () => {
		shipmentsInInvoice?.shipments?.map((shipment: Shipment) =>
			updateStatus.mutate({
				hbl: shipment.hbl,
				isScanned: true,
				timestamp: new Date().toISOString(),
			}),
		);
	};

	const handleScan = (scannedHbl: string) => {
		const hblNumber = scannedHbl.startsWith("CTE") ? scannedHbl : scannedHbl.split(",")[1];
		const formattedHbl = hblNumber?.trim() ?? scannedHbl;
		if (
			shipmentsInInvoice?.shipments?.find((shipment: Shipment) => shipment.hbl === formattedHbl)
		) {
			updateStatus.mutate({
				hbl: formattedHbl,
				isScanned: true,
				timestamp: new Date().toISOString(),
			});
		} else {
			setHbl(formattedHbl);
		}
	};

	/* const clearCache = () => {
		setHbl("");
		localStorage.removeItem("delivery-shipments");
		toast.success("Entrega Descartada");
		navigate("/delivery");
	}; */

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
					<ScanBarcode className="w-4 h-4 text-sky-600 animate-pulse" />
				</Button>
			</div>
			{isCameraOpen ? (
				<CameraScan onScan={handleScan} isLoading={false} />
			) : (
				<HBLScanner handleScan={handleScan} />
			)}

			{shipmentsInInvoice ? (
				<div className="container mx-auto p-2 rounded-lg ">
					<div className="mt-2 pb-2 text-xs flex justify-between items-center">
						<div className="flex flex-col gap-2">
							<span className="flex items-center gap-1">
								<File className="h-4 w-4 text-foreground-muted" />

								<p className="text-sm text-foreground">{shipmentsInInvoice?.invoiceId}</p>
							</span>
						</div>
						<div className="flex items-center gap-2">
							<Button variant="outline" size="sm" onClick={() => markShipmentAsScanned()}>
								Mark All
							</Button>
							<Badge className="ml-2 bg-sky-500/20 text-sky-500">
								<div className="flex items-center gap-1">
									<span>
										{
											shipmentsInInvoice?.shipments?.filter(
												(shipment: Shipment) => shipment.isScanned,
											).length
										}
										/ {shipmentsInInvoice?.shipments?.length}
									</span>
									<span></span>
								</div>
							</Badge>
							<Button variant="ghost" size="sm" className="h-8 px-2">
								{shipmentsInInvoice?.shipments?.length > 0 ? (
									<ChevronUp className="h-5 w-5" />
								) : (
									<ChevronDown className="h-5 w-5" />
								)}
							</Button>
						</div>
					</div>
					<Separator />

					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<div className=" flex m-1 p-2 justify-center items-center ">
								<Button
									className="w-full bg-sky-500/20 text-sky-500 hover:bg-sky-500/40"
									disabled={shipmentsInInvoice?.shipments?.length === 0}
									type="submit"
								>
									{mutation.isPending ? "Guardando..." : "Continuar"}
								</Button>
							</div>
						</form>
					</Form>

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
			) : isLoading ? (
				<div className="flex items-center justify-center h-full">
					<Loader />
				</div>
			) : (
				<>
					{isError ? (
						<div className="flex gap-2 items-center justify-center mt-8">
							<AlertCircle className="w-4 h-4 text-red-500" />
							<p>No se encontraron envíos</p>
						</div>
					) : (
						<NoShipments />
					)}
				</>
			)}
		</div>
	);
}
