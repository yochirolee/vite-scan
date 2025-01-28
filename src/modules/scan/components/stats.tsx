import { CloudUpload } from "lucide-react";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const Stats = ({ parcels }: { parcels: any[] }) => {
	const stats = useMemo(() => {
		const total = parcels.length;
		const scanned = parcels.filter((parcel) => parcel.scanned).length;
		const pending = parcels.filter((parcel) => !parcel.scanned).length;
		return { total, scanned, pending };
	}, [parcels]);

	return (
		<div className="mx-2">
			<Card className="grid bg-muted h-16 gap-2 p-2 grid-cols-5">
				<div className="bg-secondary rounded-lg text-center flex flex-col justify-center items-center">
					<span className="text-xs text-muted-foreground">Total</span>
					<span className="text-sm font-bold">{stats.total}</span>
				</div>
				<div className="bg-secondary rounded-lg text-center flex flex-col justify-center items-center">
					<span className="text-xs text-muted-foreground">Scanned</span>
					<span className="text-sm font-bold">{stats.scanned}</span>
				</div>
				<div className="bg-secondary rounded-lg text-center flex flex-col justify-center items-center">
					<span className="text-xs text-muted-foreground">Pending</span>
					<span className="text-sm font-bold">{stats.pending}</span>
				</div>
				<div className="bg-secondary rounded-lg text-center flex flex-col justify-center items-center">
					<span className="text-xs text-muted-foreground">Not Declared</span>
					<span className="text-sm font-bold">0</span>
				</div>
				<Button variant="outline" className="w-full h-full flex justify-center items-center">
					<CloudUpload className="h-4 w-4" />
				</Button>
			</Card>
		</div>
	);
};
