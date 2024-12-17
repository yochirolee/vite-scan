import { Badge } from "@/components/ui/badge";
import { Scanner, IDetectedBarcode } from "@yudiel/react-qr-scanner";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { base64Beep } from "@/assets/base64Beep";

export const ScanPage2 = () => {
	const [scannedCodes, setScannedCodes] = useState<string[]>([]);
	const handleScan = (detectedCodes: IDetectedBarcode[]) => {
		if (detectedCodes.length > 0) {
			const audio = new Audio(base64Beep);
			audio.play().catch(console.error);
			
			setScannedCodes((prev) => [...prev, detectedCodes[0].rawValue]);
			setHbls((prev) => [...prev, detectedCodes[0].rawValue.split(",")[1]]);
		}
	};
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [hbls, setHbls] = useState<string[]>([]);
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		console.log(scannedCodes);
		setIsSubmitting(false);
	};
	const handleError = () => {
		toast({
			title: "Error",
			description: "Error al escanear el código QR",
			variant: "destructive",
		});
	};


	return (
		<div>
			<Scanner
				onScan={handleScan}
				onError={handleError}
				constraints={{ facingMode: "environment" }}
			/>
			<div className=" rounded-lg h-full my-1 mx-2 shadow-sm space-y-2 mt-2 ">
				<form onSubmit={handleSubmit} className="flex mx-2 flex-col gap-2">
					<Button className="w-full mx-auto" disabled={isSubmitting || hbls.length === 0}>
						<Badge>{scannedCodes.length}</Badge>
						{isSubmitting ? "Enviando..." : "Confirmar Entrega"}
					</Button>
				</form>

				{scannedCodes.length > 0 ? (
					<ScrollArea className="h-96 px-2  ">
						{scannedCodes.map((item) => (
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
		</div>
	);
};
