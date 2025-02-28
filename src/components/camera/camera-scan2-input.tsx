import { useEffect, useRef, useState } from "react";
import { Lightbulb, LightbulbOff, Loader2 } from "lucide-react";
import QrScanner from "qr-scanner";
import { Button } from "../ui/button";
import useSound from "use-sound";
import scanSound from "../../success-beep.mp3";
// Rules applied: TypeScript Usage, Functional Programming

export default function CameraScanInputNimiq({
	handleScan,
	isPending,
}: {
	handleScan: (data: string) => void;
	isPending: boolean;
}) {
	const videoRef = useRef<HTMLVideoElement>(null);
	let qrScanner: QrScanner | null = null;
	const [isTorchOn, setIsTorchOn] = useState<boolean>(false);
	const [isTorchAvailable, setIsTorchAvailable] = useState<boolean>(false);
	const [play] = useSound(scanSound);

	useEffect(() => {
		if (!videoRef.current || isPending) return;

		qrScanner = new QrScanner(
			videoRef.current,
			(result) => {
				handleScan(result.data);
				play();
			},
			{
				returnDetailedScanResult: true,
				highlightScanRegion: true,
				highlightCodeOutline: true,
				maxScansPerSecond: 1,
			},
		);
		
		qrScanner.start();

		return () => {
			qrScanner?.stop();
		};
	}, []);

	const handleTorchToggle = async () => {
		try {
			await qrScanner?.toggleFlash();
		} catch (error) {
			console.error("Failed to toggle torch:", error);
		}
	};

	return (
		<div className="relative h-[33vh] rounded-md overflow-hidden">
			<video ref={videoRef} className="w-full h-[33vh] object-cover" autoPlay playsInline />

			{isPending && (
				<div className="absolute inset-0 flex items-center justify-center bg-gray-500/90">
					<Loader2 className="w-6 h-6 text-sky-700 animate-spin" />
				</div>
			)}

			<div className="absolute inline-flex items-center gap-2 bottom-2 z-10 right-2">
				<Button variant="ghost" size="icon" onClick={handleTorchToggle}>
					{isTorchAvailable ? (
						<Lightbulb className="w-4 h-4" />
					) : (
						<LightbulbOff className="w-4 h-4 text-muted-foreground" />
					)}
				</Button>
			</div>
		</div>
	);
}
