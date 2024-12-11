import { QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { useState, useEffect } from "react";
import QrScanner from "qr-scanner";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ScanPage() {
	const videoRef = useRef(null);
	const [qrCodeData, setQrCodeData] = useState<string[]>([]);

	const handleScan = (data: string) => {
		console.log("Scanning data", data);
		setQrCodeData((prev) => [...prev, data]);
	};

	useEffect(() => {
		let qrScanner: QrScanner | null = null;

		if (!videoRef.current) return;

		if (videoRef.current) {
			qrScanner = new QrScanner(
				videoRef.current,
				(result) => {
					console.log("Decoded QR code:", result.data);
					setQrCodeData((prev) => [...prev, result.data]);
				},
				{
					highlightScanRegion: true,
					highlightCodeOutline: true,
					maxScansPerSecond: 1,
				},
			);

			qrScanner.start();

			return () => {
				qrScanner?.stop();
			};
		}
	}, []);

	return (
		<main className="p-4 space-y-4">
			<div className="aspect-video  rounded-lg border-2 border-dashed  flex items-center justify-center">
				<video ref={videoRef}></video>
			</div>

			<Button className="w-full">Scan Package</Button>

			<div className=" rounded-lg shadow-sm space-y-2 ">
				<h2 className="font-medium">Last Scanned Package</h2>
				{qrCodeData.length > 0 ? (
					<div className="text-sm text-gray-600">
						<ScrollArea className="h-[400px]">
							{qrCodeData.map((data, index) => (
								<div className="mb-2 p-2 border rounded " key={index}>
									<p className="break-all whitespace-pre-wrap">{data}</p>
								</div>
							))}
						</ScrollArea>
					</div>
				) : (
					<div className="text-sm text-gray-600">
						<p>No package scanned yet</p>
					</div>
				)}
			</div>
		</main>
	);
}
