import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CameraIcon } from "lucide-react";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselPrevious,
	CarouselNext,
} from "@/components/ui/carousel";
import { Card, CardContent } from "../ui/card";

export default function ShipmentDeliveryImagesViewer({
	images,
}: {
	images: { imageUrl: string }[];
}) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<div className="flex relative flex-row gap-2">
					<CameraIcon className="w-4 h-4" />
					<span className="absolute -top-2 -right-2 text-white bg-green-500 rounded-full w-4 h-4 flex items-center justify-center text-xs ">
						{images.length}
					</span>
				</div>
			</DialogTrigger>
			<DialogContent >
				<Carousel className=" py-6 relative">
					<CarouselContent className="">
						{images.map((image, index) => (
							<CarouselItem key={index}>
								<div className="p-1">
									<Card className=" rounded-lg">
										<CardContent className=" p-0 rounded-lg">
											<img src={image.imageUrl} alt="image" className="aspect-square  object-cover" />
										</CardContent>
									</Card>
								</div>
							</CarouselItem>
						))}
					</CarouselContent>
					<div className="flex justify-between absolute bottom-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
						<CarouselPrevious />
						<CarouselNext />
					</div>
				</Carousel>
			</DialogContent>
		</Dialog>
	);
}
