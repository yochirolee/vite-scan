import { useGetShipmentsByUser } from "@/hooks/use-shipments";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useMemo } from "react";
import { Loader } from "@/components/common/loader";
import { getIcon } from "@/components/common/getIcon";
import ShipmentSheetDetails from "@/components/shipments/shipment-sheet-details";

interface Shipment {
	hbl: string;
	invoiceId: number;
	sender: string;
	receiver: string;
	description: string;
	state: string;
	city: string;
	status: { name: string; code: string };
	timestamp: string;
}

interface ShipmentGroup {
	invoiceId: number;
	shipments: Shipment[];
}

export default function ShipmentsHistory() {
	const { data, isLoading, isError } = useGetShipmentsByUser();

	const groupedShipments = useMemo(() => {
		if (!data) return [];

		return Object.values(
			data.reduce((acc: Record<number, ShipmentGroup>, shipment: Shipment) => {
				if (!acc[shipment.invoiceId]) {
					acc[shipment.invoiceId] = {
						invoiceId: shipment.invoiceId,
						shipments: [],
					};
				}
				acc[shipment.invoiceId].shipments.push(shipment);
				return acc;
			}, {} as Record<number, ShipmentGroup>),
		) as ShipmentGroup[];
	}, [data]);

	if (isLoading)
		return (
			<div className="flex justify-center items-center h-screen">
				<Loader />
			</div>
		);
	if (isError)
		return <div className="grid justify-center items-center h-full">Error loading shipments</div>;

	return (
		<div className="container mx-auto p-2 rounded-lg">
			<h1 className="mb-4">History</h1>
			<ScrollArea className="h-[500px] p-1">
				{groupedShipments.map((group) => (
					<Card className="mb-4 mx-2" key={group.invoiceId}>
						<CardHeader className="p-2 border-b bg-sky-500/10">
							<CardTitle className="text-sm font-bold  text-sky-500">
								Invoice #{group.invoiceId}
							</CardTitle>
						</CardHeader>
						<CardContent className="p-2">
							{group.shipments.map((shipment: Shipment) => (
								<div
									className="flex justify-between my-2 border-b border-dashed py-2"
									key={shipment.hbl}
								>
									<div>
										<h2 className="text-sm font-bold">{shipment.hbl}</h2>
										<p className="text-[12px] font-light text-foreground/80">
											{shipment.description}
										</p>
									</div>
									<div className="flex  items-end">
										<div className="flex flex-col items-end">
											<Badge variant="secondary" className=" flex items-center gap-2  border-none">
												{getIcon(shipment.status.code)}
												<div className="truncate">{shipment.status.name}</div>
											</Badge>
											<time className="text-[12px] font-light text-foreground/80">
												{formatDate(shipment.timestamp)}
											</time>
										</div>
										<ShipmentSheetDetails hbl={shipment.hbl} />
									</div>
								</div>
							))}
						</CardContent>
					</Card>
				))}
			</ScrollArea>
		</div>
	);
}
