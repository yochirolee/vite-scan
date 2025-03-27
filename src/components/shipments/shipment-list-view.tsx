import { formatDate } from "@/lib/utils";
import { CheckCircle, Clock } from "lucide-react";
import { z } from "zod";
import ShipmentSheetDetails from "./shipment-sheet-details";
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
	console.log(shipments);
	return (
		<div className="flex flex-col  gap-2 pb-2 mx-4  ">
			{shipments?.map((shipment) => (
				<div
					className="flex flex-1 min-h-20 justify-between items-center gap-4 px-2 border rounded-lg py-2"
					key={shipment?.hbl}
				>
					<div className="text-sm flex flex-col  justify-between">
						<span className="text-sm ">{shipment?.hbl}</span>
						<p className="text-xs  dark:text-muted-foreground">{shipment?.description}</p>
					</div>

					<div className=" flex justify-end w-full items-center">
						{shipment?.isScanned ? (
							<div className="flex flex-col justify-end gap-1">
								<div className="flex justify-end gap-1">
									<CheckCircle className="w-4 h-4 text-green-500" />
									<span className="text-xs text-green-500">Scanned {shipment?.status}</span>
								</div>

								<span className="text-xs font-light justify-end ">
									{formatDate(shipment?.timestamp)}
								</span>
							</div>
						) : (
							<div className="flex items-center gap-1">
								<Clock className="w-4 h-4 text-gray-500" />
								<span className="text-xs text-gray-500">Pendiente {shipment?.status}</span>
								
							</div>
						)}
					</div>
					<ShipmentSheetDetails hbl={shipment?.hbl} />
				</div>
			))}
		</div>
	);
}
