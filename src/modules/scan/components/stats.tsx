import { useMemo } from "react";
import { Card } from "@/components/ui/card";

export const Stats = ({ parcels }: { parcels: any[] }) => {
	const stats = useMemo(() => {
		const total = parcels.length;
		const scanned = parcels.filter((parcel) => parcel.scanned).length;
		const pending = parcels.filter((parcel) => !parcel.scanned).length;
		return { total, scanned, pending };
	}, [parcels]);

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
