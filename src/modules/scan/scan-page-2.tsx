import { Badge } from "@/components/ui/badge";
import { Scanner, IDetectedBarcode } from "@yudiel/react-qr-scanner";
import { useState } from "react";

export const ScanPage2 = () => {
	const [scannedCodes, setScannedCodes] = useState<string[]>([]);
	const handleScan = (detectedCodes: IDetectedBarcode[]) => {
		if (detectedCodes.length > 0) {
			setScannedCodes((prev) => [...prev, detectedCodes[0].rawValue]);
		}
	};

	return (
		<div>
			<Scanner onScan={handleScan}  />
			<ul className="my-2 px-2">
				{scannedCodes.map((code, index) => (
					<li className="border p-2 my-1 rounded-md" key={index}>
						<div className="flex justify-between items-center">
							<span className="text-xs">{code}</span>
							<Badge variant="secondary">{new Date().toLocaleTimeString()}</Badge>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
};
