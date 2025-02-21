import { useMemo } from "react";
import { Card } from "@/components/ui/card";

interface Shipment {
	hbl: string;
	timestamp?: string;
	scanned?: boolean;
}

export const Stats = ({ shipments }: { shipments: Shipment[] }) => {
	const stats = useMemo(() => {
		const total = shipments.length;
		const scanned = shipments.filter((shipment) => shipment.scanned).length;
		const pending = shipments.filter((shipment) => !shipment.scanned).length;
		return { total, scanned, pending };
	}, [shipments]);

	return (
		<Card className="grid  bg-muted h-10 gap-2  grid-cols-4">
			<div className="bg-secondary rounded-lg text-center flex flex-col justify-center items-center">
				<span className="text-xs text-muted-foreground">Total</span>
				<span className="text-sm font-bold">{stats.total}</span>
			</div>
			<div className="bg-secondary rounded-lg text-center flex flex-col justify-center items-center">
				<span className="text-xs text-green-600">Scanned</span>
				<span className="text-sm font-bold text-green-600">{stats.scanned}</span>
			</div>
			<div className="bg-secondary rounded-lg text-center flex flex-col justify-center items-center">
				<span className="text-xs text-muted-foreground">Pending</span>
				<span className="text-sm font-bold">{stats.pending}</span>
			</div>
			<div className="bg-secondary rounded-lg text-center flex flex-col justify-center items-center">
				<span className="text-xs text-muted-foreground">Not Declared</span>
				<span className="text-sm font-bold">0</span>
			</div>
		</Card>
	);
};
