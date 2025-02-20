import { BarcodeScanner } from "@capacitor-community/barcode-scanner";
import { useEffect, useState } from "react";
import { useSound } from "use-sound";
import scanSound from "../../success-beep.mp3";

interface CameraScanProps {
	onScan: (hbl: string) => void;
	isLoading: boolean;
}

export const CameraScan = ({ onScan, isLoading }: CameraScanProps): JSX.Element => {
	const [play] = useSound(scanSound);
	const [isScanning, setIsScanning] = useState(false);

	useEffect(() => {
		const startScan = async () => {
			const status = await BarcodeScanner.checkPermission({ force: true });

			if (status.granted) {
				document.querySelector(".scan-area")?.classList.add("scanner-active");
				setIsScanning(true);

				const result = await BarcodeScanner.startScan();
				if (result.hasContent && !isLoading) {
					onScan(result.content);
					play();
				}
			}
		};

		startScan();

		return () => {
			BarcodeScanner.stopScan();
			document.querySelector(".scan-area")?.classList.remove("scanner-active");
			setIsScanning(false);
		};
	}, [onScan, isLoading, play]);

	return (
		<div className="flex flex-col items-center justify-center p-4">
			<div className="scan-area w-full max-w-md h-64 rounded-lg overflow-hidden">
				{isScanning && <div className="w-20 h-20 bg-red-500" />}
			</div>
		</div>
	);
};
