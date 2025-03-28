import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function PhotoCamera({
	handleAddPhoto,
}: {
	handleAddPhoto: (photo: string) => void;
}) {
	const [image, setImage] = useState<string | null>(null);
	const videoRef = useRef<HTMLVideoElement>(null);

	const startCamera = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: { facingMode: "environment" },
			});
			if (videoRef.current) {
				videoRef.current.srcObject = stream;
			}
		} catch (err) {
			console.error("Error accessing camera:", err);
		}
	};

	useEffect(() => {
		startCamera();
	}, [image]);

	const takePhoto = () => {
		const video = videoRef.current;
		if (!video) return;
		const canvas = document.createElement("canvas");
		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;
		canvas.getContext("2d")?.drawImage(video, 0, 0);
		const dataUrl = canvas.toDataURL("image/jpeg");
		handleAddPhoto(dataUrl);
	};

	return (
		<div className="flex flex-col items-center gap-4 p-4">
			{!image ? (
				<>
					<div className="relative w-full max-w-md rounded-lg overflow-hidden">
						<video ref={videoRef} autoPlay playsInline className="w-full h-auto" />
						<Button
							onClick={takePhoto}
							className="absolute rounded-full w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/10 bottom-2 left-1/2 transform -translate-x-1/2"
						>
							<Camera className="h-6 w-6 text-white" />
						</Button>
					</div>
				</>
			) : (
				<div className="flex flex-col items-center gap-4">
					<img src={image} alt="Captured" className="w-full max-w-md rounded-lg shadow-lg" />
					<Button onClick={() => setImage(null)} variant="secondary" className="w-full max-w-md">
						Take Another Photo
					</Button>
				</div>
			)}
		</div>
	);
}
