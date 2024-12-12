import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { useState, useEffect } from "react";
import QrScanner from "qr-scanner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuthContext } from "@/context/auth-context";
import { baseUrl } from "@/api/auth-api";

export default function ScanPage() {
	const videoRef = useRef(null);
	const { token } = useAuthContext();
	const [qrCodeData, setQrCodeData] = useState<string[]>([]);
	const [hbls, setHbls] = useState<string[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			const payload = {
				hbls: hbls,
				updatedAt: new Date().toLocaleDateString(),
				locationId: 7,
				statusId: 8,
			};

			const response = await fetch(`${baseUrl}/parcels/upsert-events`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(payload),
			});

			if (!response.ok) {
				throw new Error("Failed to submit");
			}

			setQrCodeData([]);
			setHbls([]);
		} catch (error) {
			console.error("Error submitting form:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	useEffect(() => {
		let qrScanner: QrScanner | null = null;

		if (!videoRef.current) return;

		if (videoRef.current) {
			qrScanner = new QrScanner(
				videoRef.current,
				(result) => {
					setQrCodeData((prev) => [...prev, result.data]);
					setHbls((prev) => [...prev, result.data.split(",")[1]]);
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
		<main className="p-2 my-2 relative h-screen space-y-2">
			<div className="aspect-video h-1/3  mx-auto  flex items-center justify-center">
				<video className="rounded-lg" ref={videoRef}></video>
			</div>

			<div className=" rounded-lg h-2/5  shadow-sm space-y-2 ">
				<h2 className="text-sm text-center">Listado de paquetes</h2>
				{qrCodeData.length > 0 ? (
					<ScrollArea className="h-[250px] p-4">
						{hbls.map((data, index) => (
							<div className="mb-2 p-2 border rounded " key={index}>
								<p className="break-all text-xs whitespace-pre-wrap">{data}</p>
							</div>
						))}
					</ScrollArea>
				) : (
					<div className="text-sm text-gray-600">
						<p>No package scanned yet</p>
					</div>
				)}
			</div>
			<div className="absolute bottom-2 w-full">
				<form onSubmit={handleSubmit}>
					<Button className="w-full" disabled={isSubmitting || hbls.length === 0}>
						{isSubmitting ? "Enviando..." : "Entregar"}
					</Button>
				</form>
			</div>
		</main>
	);
}
