import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CameraIcon } from "lucide-react";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselPrevious,
	CarouselNext,
} from "@/components/ui/carousel";

export default function ShipmentDeliveryImagesViewer({ images }: { images: { imageUrl: string }[] }) {
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
			<DialogContent>
				<Carousel>
					<CarouselContent>
						{images.map((image, index) => (
							<CarouselItem key={index}>
								<img
									src={image.imageUrl}
									alt="image"
									className="aspect-square h-full rounded-lg p-4"
								/>
							</CarouselItem>
						))}
					</CarouselContent>
					<CarouselPrevious />
					<CarouselNext />
				</Carousel>
			</DialogContent>
		</Dialog>
	);
}
