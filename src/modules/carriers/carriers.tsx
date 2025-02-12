import { HBLScanner } from "../scan/components/hbl-scanner";
import { useState } from "react";
import { ParcelsList } from "../scan/components/parcels-list";
import { ParcelInterface } from "@/types/parcel";

export function Carriers() {
	const [parcels, setParcels] = useState<ParcelInterface[]>([]);
	const [scanMethod, setScanMethod] = useState<"hbl" | "qr">("hbl");
	const handleScan = (hbl: string) => {
		//if hbl is already in the list, don't add it
		if (parcels.some((parcel) => parcel.hbl === hbl)) {
			return;
		}
		setParcels([...parcels, { hbl }]);
	};
	return (
		<div>
			<h1>Carriers</h1>
			<div className="flex flex-col gap-4">
				{<HBLScanner handleScan={handleScan} />}
				<ParcelsList parcels={parcels} />
			</div>
		</div>
	);
}
