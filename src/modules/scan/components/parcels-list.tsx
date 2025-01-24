import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useVirtualizer } from "@tanstack/react-virtual";
import { CheckCircle, CircleOff, EllipsisVerticalIcon } from "lucide-react";

export function ParcelsList({ parcels }: { parcels: any[] }) {
	// Create a ref for the scrolling container
	const parentRef = useRef<HTMLDivElement>(null);

	// Set up the virtualizer
	const virtualizer = useVirtualizer({
		count: parcels.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => 100, // Estimate height of each item in pixels
		overscan: 5, // Number of items to render outside of the visible area
	});

	return (
		<div ref={parentRef} className="h-[calc(100vh-300px)] overflow-auto px-2">
			{/* Create a div with the total size of all items */}
			<div
				style={{
					height: `${virtualizer.getTotalSize()}px`,
					width: "100%",
					position: "relative",
				}}
			>
				{virtualizer.getVirtualItems().map((virtualItem) => {
					const item = parcels[virtualItem.index];
					return (
						<div
							key={item.hbl}
							style={{
								position: "absolute",
								top: 6,
								transform: `translateY(${virtualItem.start}px)`,
								width: "100%",
							}}
						>
							<Card
								className={`
									${item.scanned ? "bg-accent" : ""}
									
									flex flex-col w-full   rounded-lg border px-0 text-left text-sm transition-all
								`}
							>
								<div className="flex flex-row gap-2 justify-between w-full">
									<div className="">
										<div className="flex gap-2 flex-col m-2">
											<div className="font-semibold">
												{item.hbl} - {item.invoiceId}
											</div>
											<div className="text-xs text-muted-foreground">{item.description}</div>
											<div className="text-xs  text-sky-800">{item.agency} </div>
										</div>
									</div>

									<div className="flex flex-row gap-2 items-center justify-center">
										<div className="flex flex-col items-end ">
											{item.scanned ? (
												<div className="flex  items-center justify-center">
													<CheckCircle className="h-3 w-3 text-green-600 mr-2" />
													<span className="text-xs text-green-600 font-thin">Scanned</span>
												</div>
											) : (
												<div className="flex  items-center justify-center">
													<CircleOff className="h-3 w-3 text-muted-foreground mr-2" />
													<span className="text-xs text-muted-foreground font-thin"> Pending</span>
												</div>
											)}
											<div className="text-[11px] text-muted-foreground">
												{item.scannedAt
													? new Date(item.scannedAt).toLocaleDateString("en-US", {
															day: "numeric",
															month: "short",
															year: "numeric",
															hour: "2-digit",
															minute: "2-digit",
													  })
													: ""}
											</div>
										</div>
										<div>
											<Button variant="ghost" size="icon">
												<EllipsisVerticalIcon className="h-3 w-3" />
											</Button>
										</div>
									</div>
								</div>
							</Card>
						</div>
					);
				})}
			</div>
		</div>
	);
}
