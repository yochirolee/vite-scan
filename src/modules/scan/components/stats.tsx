import { CloudUpload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const Stats = () => {
	return (
		<div className="absoluted  bottom-0">
			<Card className="grid bg-muted h-16 gap-2 p-2 grid-cols-5">
				<div className="bg-secondary rounded-lg text-center flex flex-col justify-center items-center">
					<span className="text-xs text-muted-foreground">Total</span>
					<span className="text-sm font-bold">10</span>
				</div>
				<div className="bg-secondary rounded-lg text-center flex flex-col justify-center items-center">
					<span className="text-xs text-muted-foreground">Scanned</span>
					<span className="text-sm font-bold">10</span>
				</div>
				<div className="bg-secondary rounded-lg text-center flex flex-col justify-center items-center">
					<span className="text-xs text-muted-foreground">Pending</span>
					<span className="text-sm font-bold">10</span>
				</div>
				<div className="bg-secondary rounded-lg text-center flex flex-col justify-center items-center">
					<span className="text-xs text-muted-foreground">Not Declared</span>
					<span className="text-sm font-bold">10</span>
				</div>
				<Button variant="outline" className="w-full h-full flex justify-center items-center">
					<CloudUpload className="h-4 w-4" />
				</Button>
			</Card>
		</div>
	);
};
