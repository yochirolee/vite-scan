import { formatDate } from "@/lib/utils";
import { CheckCircle } from "lucide-react";
import { z } from "zod";
import ShipmentSheetDetails from "./shipment-sheet-details";
import { Button } from "../ui/button";
import { useUpdateShipmentStatus } from "@/hooks/use-shipments";
const shipmentsProps = z.object({
	shipments: z.array(
		z.object({
			hbl: z.string(),
			isScanned: z.boolean(),
			timestamp: z.string(),
			description: z.string(),
			status: z.string(),
		}),
	),
});

type Shipment = z.infer<typeof shipmentsProps>["shipments"][number];

export default function ShipmentListView({ shipments }: { shipments: Shipment[] }) {
	const orderShipments = shipments.sort((a, b) => {
		if (a.isScanned && !b.isScanned) return -1;
		if (!a.isScanned && b.isScanned) return 1;
		return 0;
	});
	const updateStatus = useUpdateShipmentStatus();

	const handleDelivery = (hbl: string) => {
		//update shipment status to delivered
		updateStatus.mutate({
			hbl,
			isScanned: true,
			timestamp: new Date().toISOString(),
		});
	};

	return (
		<div className="flex flex-col  gap-2 pb-2 pr-4  ">
			{orderShipments?.map((shipment) => (
				<div
					className={`flex flex-1 min-h-20 justify-between items-center gap-4 px-2  rounded-lg py-2 ${
						shipment.isScanned
							? "bg-gray-800/40 border-green-800/40"
							: "bg-gray-800/10 text-muted-foreground border-gray-800/40"
					}`}
					key={shipment?.hbl}
				>
					<div className="text-sm flex flex-col  justify-between">
						<span className="text-sm ">{shipment?.hbl}</span>
						<p className="text-xs ">{shipment?.description}</p>
					</div>

					<div className=" flex justify-end w-full items-center">
						{shipment?.isScanned ? (
							<div className="flex flex-col justify-end gap-1">
								<div className="flex justify-end gap-1">
									<CheckCircle className="w-4 h-4 text-green-500" />
									<span className="text-xs text-green-500">Scanned </span>
								</div>
								<div className="flex justify-end gap-1">
									<span className="text-xs text-muted-foreground font-extralight">
										{shipment?.status}
									</span>
								</div>

								<span className="text-xs font-light justify-end ">
									{formatDate(shipment?.timestamp)}
								</span>
							</div>
						) : (
							<Button
								onClick={() => handleDelivery(shipment?.hbl)}
								className="bg-green-500/10 text-white hover:bg-green-600"
							>
								<span className="text-xs">Entregar</span>
							</Button>
						)}
					</div>
					<ShipmentSheetDetails hbl={shipment?.hbl} />
				</div>
			))}
		</div>
	);
}
