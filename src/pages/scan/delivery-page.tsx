import { useState } from "react";
import { AlertCircle, Camera, CheckCircle, Clock, MapPinCheck } from "lucide-react";
import { HBLScanner } from "@/components/hbl-scanner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Phone, IdCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CameraScan } from "@/components/camera/camera-scan-input";
import { useGetShipmentsInInvoice } from "@/hooks/use-shipments";
import { Loader } from "@/components/common/loader";
import { formatTimestamp } from "@/utils/dateFormatter";

export default function DeliveryPage() {
	//const [open, setOpen] = useState(false);
	const [hbl, setHbl] = useState("");
	const { data: shipments, isLoading, isError } = useGetShipmentsInInvoice(hbl);

	// Update shipments when shipmentsInInvoice changes, maintaining previous data

	const handleScan = (hbl: string) => {
		setHbl(hbl);
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
			<div className="container mx-auto p-2  m-4 rounded-lg ">
				<div className="flex  items-center dark:bg-gray-900 p-2 rounded-lg">
					<div className="flex flex-col ml-2 w-full space-y-1 ">
						<div className="flex items-center w-full justify-between pb-2 gap-2">
							<p className="text-md pb-1  font-medium">Leidiana Torres Roca</p>
							<div className="flex items-center gap-2">
								<span className="text-sm font-medium">Scanned:</span>
								<Badge variant="outline" className="bg-green-500 text-white">
									<span className="text-sm font-medium">{shipments?.length}</span>
								</Badge>
							</div>
						</div>

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
						</div>
					</div>
				</div>

				<div className="flex items-center mt-2 justify-end pr-1 gap-4">
					<div className="flex items-center gap-2">
						<span className="text-sm font-medium dark:text-gray-400">Facturas:</span>
						<span className="text-sm font-medium">0</span>
					</div>
					<div className="flex items-center gap-2">
						<span className="text-sm font-medium dark:text-gray-400">Total de Paquetes:</span>
						<span className="text-sm font-medium">{shipments?.length ? shipments?.length : 0}</span>
					</div>
				</div>

				<ScrollArea className="flex h-[60vh] pb-10  flex-col gap-1">
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
					{shipments?.map((shipment) => (
						<Card className="mt-2 mx-4" key={shipment?.hbl}>
							<CardHeader className="px-4 py-2">
								<CardTitle className="text-sm flex items-center justify-between">
									<span className="text-sm font-medium">{shipment?.hbl}</span>
									{shipment?.isScanned ? (
										<div className="flex flex-col items-center gap-1">
											<div className="flex items-center gap-1">
												<CheckCircle className="w-4 h-4 text-green-500" />
												<span className="text-xs text-green-500">Scanned</span>
											</div>

											<span className="text-xs justify-end ">
												{formatTimestamp(shipment?.timestamp)}
											</span>
										</div>
									) : (
										<div className="flex items-center gap-1">
											<Clock className="w-4 h-4 text-orange-500" />
											<span className="text-xs text-orange-500">Pendiente</span>
										</div>
									)}
								</CardTitle>
							</CardHeader>
							<CardContent className="px-4 ">
								<div className="flex justify-between items-center">
									<p className="text-sm dark:text-muted-foreground">{shipment?.description}</p>
								</div>
							</CardContent>
						</Card>
					))}
				</ScrollArea>
			</div>
			<div className="absolute w-full bottom-0  ">
				{/* <DeliveryConfirmationForm open={open} setOpen={setOpen} /> */}
			</div>
		</div>
	);
}
