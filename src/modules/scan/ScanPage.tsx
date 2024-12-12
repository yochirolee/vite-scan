import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { useState, useEffect } from "react";
import QrScanner from "qr-scanner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuthContext } from "@/context/auth-context";
import { baseUrl } from "@/api/auth-api";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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
		<main className="m-2  my-2 flex flex-col space-y-2">
			<div className=" aspect-square   overflow-hidden  rounded-lg relative border-gray-300">
				<video className="flex-1 object-cover aspect-square" ref={videoRef}></video>
			</div>

			<div className=" rounded-lg h-full my-1  shadow-sm space-y-2 ">
				<form onSubmit={handleSubmit}>
					<Button className="w-full" disabled={isSubmitting || hbls.length === 0}>
						<Badge>{hbls.length}</Badge>
						{isSubmitting ? "Enviando..." : "Confirmar Entrega"}
					</Button>
				</form>

				{qrCodeData.length > 0 ? (
					<ScrollArea className="h-96 px-2  ">
						{qrCodeData.map((item) => (
							<button
								key={item.split(",")[1]}
								className={cn(
									"flex flex-col w-full my-1  items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
									item.split(",")[1] === item.split(",")[1] && "bg-muted",
								)}
								/* onClick={() =>
									setSelectedItem({
										...selectedItem,
										hbl: item.hbl,
									})
								} */
							>
								<div className="flex w-full flex-col gap-1">
									<div className="flex items-center">
										<div className="flex items-center gap-2">
											<div className="font-semibold">{item.split(",")[1]}</div>
											{/* {!item.read && <span className="flex h-2 w-2 rounded-full bg-blue-600" />} */}
										</div>
										{/* 	<div
											className={cn(
												"ml-auto text-xs",
												selectedItem.hbl === item.hbl ? "text-foreground" : "text-muted-foreground",
											)}
										>
											
										</div> */}
									</div>
									<div className="text-xs font-medium">{item.split(",")[2]}</div>
								</div>
								<div className="line-clamp-2 text-xs text-muted-foreground">
									{item.split(",")[3]}
								</div>
							</button>
						))}
					</ScrollArea>
				) : (
					<div className="text-sm text-gray-600">
						<p>No package scanned yet</p>
					</div>
				)}
			</div>
		</main>
	);
}
