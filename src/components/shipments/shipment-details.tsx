import { MoreVertical } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetShipmentByHbl } from "@/hooks/use-shipments";
import ShipmentTimeline from "./shipment-timeline";
import { Loader } from "../common/loader";

export default function ShipmentDetails({ hbl }: { hbl: string | undefined }) {
	if (!hbl) return null;
	const { data: shipment, isLoading, isError } = useGetShipmentByHbl(hbl);

	return (
		<div className="flex pb-4 flex-col gap-4">
			{isError && <p>Error loading shipment</p>}
			{isLoading && <Loader />}
			{shipment && (
				<div className="h-full">
					<Card className="overflow-hidden border-none p-0 m-0">
						<CardHeader className="flex flex-row justify-between items-start">
							<div className="grid grid-cols-2 items-center  ">
								<div className="flex flex-col  gap-1">
									<div className="text-lg font-semibold">{hbl}</div>{" "}
									<span className="text-sm text-muted-foreground">{shipment?.description}</span>
									<time className="text-sm text-muted-foreground">
										{new Date(shipment?.invoiceDate).toLocaleDateString("en-US", {
											month: "short",
											day: "numeric",
											year: "numeric",
										})}
									</time>
								</div>
							</div>
							<div className="flex flex-col gap-1 ">
								<div className="text-sm text-sky-700 font-semibold">{shipment?.agency?.name}</div>
								<div className="ml-auto flex items-center gap-1">
									<Button size="sm" variant="outline" className="h-8 gap-1">
										{shipment?.invoiceId}
									</Button>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button size="icon" variant="outline" className="h-8 w-8">
												<MoreVertical className="h-3.5 w-3.5" />
												<span className="sr-only">More</span>
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<DropdownMenuItem>Edit</DropdownMenuItem>
											<DropdownMenuItem>Export</DropdownMenuItem>
											<DropdownMenuSeparator />
											<DropdownMenuItem>Trash</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
							</div>{" "}
						</CardHeader>
						<div className="px-6 text-sm">
							<div className="grid gap-3">
								<div className="font-semibold bg-muted/20 p-2 rounded-md">Envia:</div>
								<dl className="grid gap-3 p-1">
									<div className="flex items-center justify-between">
										<dt className="text-muted-foreground">Nombre</dt>
										<dd>{shipment?.sender?.name}</dd>
									</div>
									<div className="flex items-center justify-between">
										<dt className="text-muted-foreground">Email</dt>
										<dd>
											<a href="mailto:">{shipment?.sender?.email}</a>
										</dd>
									</div>
									<div className="flex items-center justify-between">
										<dt className="text-muted-foreground">Phone</dt>
										<dd>
											<a href="tel:">+1{shipment?.sender?.mobile}</a>
										</dd>
									</div>
								</dl>
							</div>
							<div className="grid gap-3 mt-4">
								<div className="font-semibold bg-muted/20 p-2 rounded-md">Recibe:</div>
								<dl className="grid gap-3 p-1">
									<div className="flex items-center justify-between">
										<dt className="text-muted-foreground">Nombre</dt>
										<dd>{shipment?.receiver?.name}</dd>
									</div>
									<div className="flex items-center justify-between">
										<dt className="text-muted-foreground">Carne</dt>
										<dd>
											<a href="mailto:">{shipment?.receiver?.ci}</a>
										</dd>
									</div>
									<div className="flex items-center justify-between">
										<dt className="text-muted-foreground">Phone</dt>
										<dd>
											<a href="tel:">+53{shipment?.receiver?.mobile}</a>
										</dd>
									</div>
								</dl>
							</div>
							<div className="grid  gap-4">
								<div className="grid gap-3">
									<div className="font-semibold bg-muted/20 p-2 rounded-md mt-4">Direccion</div>
									<address className="grid gap-0.5 not-italic text-muted-foreground p-1">
										<span>{shipment?.receiver?.address}</span>
										<span className="font-semibold">
											{shipment?.receiver?.state}, {shipment?.receiver?.city}
										</span>
									</address>
								</div>
							</div>
						</div>
					</Card>
					<ShipmentTimeline events={shipment?.events || []} />
				</div>
			)}
		</div>
	);
}
