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
	const [isScanning, setIsScanning] = useState<boolean>(false);

	useEffect(() => {
		const startScan = async (): Promise<void> => {
			// Check camera permission
			const status = await BarcodeScanner.checkPermission({ force: true });

			if (status.granted) {
				// Make background transparent
				document.querySelector("body")?.classList.add("scanner-active");

				// Start scanning
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
			// Cleanup when component unmounts
			BarcodeScanner.stopScan();
			document.querySelector("body")?.classList.remove("scanner-active");
			setIsScanning(false);
		};
	}, [onScan, isLoading, play]);

	return (
		<div>
			<div className="flex h-[33vh] flex-col gap-4">
				{isScanning && <div className="w-full h-full scanner-view" />}
			</div>
		</div>
	);
};
