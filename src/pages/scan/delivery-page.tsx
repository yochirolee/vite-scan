import { useState } from "react";
import { AlertCircle, Camera, Trash } from "lucide-react";
import { HBLScanner } from "@/components/hbl-scanner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CameraScan } from "@/components/camera/camera-scan-input";
import { useDeliveryShipments, useGetShipmentsInInvoice } from "@/hooks/use-shipments";
import { Loader } from "@/components/common/loader";
import { Form } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import ShipmentListView from "@/components/shipments/shipment-list-view";
import { useGeolocation } from "@uidotdev/usehooks";
import { useNavigate } from "react-router-dom";

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
	const { data: shipments, isLoading, isError } = useGetShipmentsInInvoice(hbl);
	const mutation = useDeliveryShipments();
	const location = useGeolocation();
	const navigate = useNavigate();

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
		setHbl(formattedHbl);
	};

	const clearCache = () => {
		setHbl("");
		localStorage.removeItem("delivery-shipments");
	};

	const onSubmit = () => {
		const shipmentsToSubmit = shipments
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
				console.log(data, "data");
				const eventsId = data.map((item: any) => item.id);
				navigate(`/delivery/photos?eventsId=${eventsId}`);
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
					<Camera className="w-4 h-4" />
				</Button>
			</div>
			{isCameraOpen ? (
				<CameraScan onScan={handleScan} isLoading={false} />
			) : (
				<HBLScanner handleScan={handleScan} />
			)}
			<div className="container mx-auto p-2 rounded-lg ">
				<div className="flex  items-center dark:bg-gray-900 p-2 rounded-lg">
					<div className="flex flex-col ml-2 w-full space-y-1 ">
						<div className="flex items-center w-full justify-between gap-2">
							<p className="text-md pb-1  font-medium">Leidiana Torres Roca</p>
							<div className="flex items-center gap-2">
								<span className="text-sm font-medium">Scanned:</span>
								<Badge variant="outline" className="bg-green-500 text-white">
									<span className="text-sm font-medium">
										{shipments?.filter((shipment) => shipment?.isScanned)?.length}/
										{shipments?.length}
									</span>
								</Badge>
							</div>
						</div>
						{/* 
						<div className="flex flex-col gap-2 justify-start  ">
							<div className="text-sm dark:text-gray-400 flex items-center gap-2		">
								<Phone className="min-w-4 h-4 " />
								<span className="ml-1">53798283</span>
							</div>
							<div className="text-sm dark:text-gray-400 flex items-center gap-2">
								<IdCard className="min-w-4 h-4" />
								<span className="ml-1">1234567890</span>
							</div>
							<div className="text-sm dark:text-gray-400 flex items-center gap-2">
								<MapPinCheck className="min-w-4 h-4 " />
								<span className="ml-2">
									Calle 62 entre 23 y 25, No 2307 Apto 3, Buena Vista, La Habana, Cuba
								</span>
							</div>
						</div> */}
					</div>
				</div>
				<div className="flex mt-4 flex-col gap-2">
					<ScrollArea className=" h-[60vh]">
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
						<ShipmentListView shipments={shipments || []} />
					</ScrollArea>
				</div>
			</div>
			<div className="absolute w-full bottom-0  ">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<Button className="w-full" type="submit">
							{mutation.isPending ? "Submitting..." : "Submit"}
						</Button>
					</form>
				</Form>

				<Button variant="outline" className="w-full mt-2" onClick={clearCache}>
					<Trash className="w-4 h-4" />
					Clear
				</Button>
			</div>
		</div>
	);
}
