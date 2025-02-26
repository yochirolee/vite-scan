import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ChevronRight } from "lucide-react";
import ShipmentDetails from "./shipment-details";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export default function ShipmentSheetDetails({ hbl }: { hbl: string }) {
	return (
		<Sheet>
			<SheetTrigger>
				<ChevronRight className="h-4 w-4 m-2 text-sky-600" />
			</SheetTrigger>
			<SheetContent className="m-0 text p-0 w-full lg:max-w-[450px]">
				<SheetHeader className="p-4 flex  text-center">
					<SheetTitle className="text-base font-semibold">Shipment Details</SheetTitle>
					<Separator />
				</SheetHeader>
				<ScrollArea className="h-[calc(100vh-40px)]">
					<ShipmentDetails hbl={hbl} />
				</ScrollArea>
			</SheetContent>
		</Sheet>
	);
}
