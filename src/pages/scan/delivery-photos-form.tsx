import { api } from "@/api/api";
import { Loader2, UploadCloud } from "lucide-react";
import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import PhotoCamera from "./photo-camera";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
// Componente para subir fotos

interface ImageOptimizationOptions {
	maxWidth: number;
	maxHeight: number;
	quality: number;
}

const optimizeImage = async (file: File, options: ImageOptimizationOptions): Promise<Blob> => {
	return new Promise((resolve) => {
		const img = new Image();
		img.src = URL.createObjectURL(file);

		img.onload = () => {
			URL.revokeObjectURL(img.src);
			const canvas = document.createElement("canvas");

			// Calculate new dimensions while maintaining aspect ratio
			let { width, height } = img;
			if (width > options.maxWidth) {
				height = Math.round((options.maxWidth * height) / width);
				width = options.maxWidth;
			}
			if (height > options.maxHeight) {
				width = Math.round((options.maxHeight * width) / height);
				height = options.maxHeight;
			}

			canvas.width = width;
			canvas.height = height;

			const ctx = canvas.getContext("2d");
			ctx?.drawImage(img, 0, 0, width, height);

			canvas.toBlob(
				(blob) => {
					if (blob) resolve(blob);
				},
				"image/jpeg",
				options.quality,
			);
		};
	});
};

export default function DeliveryPhotosForm() {
	const navigate = useNavigate();
	const { eventsId } = useLocation().state as { eventsId: string[] };
	
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [photos, setPhotos] = useState<string[]>([]);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);

	const uploadMutation = useMutation({
		mutationFn: async (formData: FormData) => {
			return api.shipments.uploadImage(formData, eventsId);
		},
		onSuccess: (response) => {
			if (response.url) {
				setPhotos([...photos, response.url]);
			}
		},
		onSettled: () => {
			setPreviewUrl(null);
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
		},
	});

	const handleAddPhoto = (newPhoto: string) => {
		// Convert data URL to Blob
		setPreviewUrl(newPhoto);
		const formData = new FormData();
		const byteString = atob(newPhoto.split(",")[1]);
		const ab = new ArrayBuffer(byteString.length);
		const ia = new Uint8Array(ab);

		for (let i = 0; i < byteString.length; i++) {
			ia[i] = byteString.charCodeAt(i);
		}

		const blob = new Blob([ab], { type: "image/jpeg" });
		const file = new File([blob], "delivery-photo.jpg", { type: "image/jpeg" });
		formData.append("file", file);
		//array of string

		uploadMutation.mutateAsync(formData);

	};

	const handleRemovePhoto = (index: number) => {
		setPhotos(photos.filter((_, i) => i !== index));
	};

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files || files.length === 0) return;

		const file = files[0];
		const preview = URL.createObjectURL(file);
		setPreviewUrl(preview);

		try {
			const optimizedImage = await optimizeImage(file, {
				maxWidth: 1200,
				maxHeight: 1200,
				quality: 0.8,
			});

			const formData = new FormData();
			formData.append("file", optimizedImage, file.name);
			formData.append("eventsId", "280866");

			await uploadMutation.mutateAsync(formData);
		} finally {
			URL.revokeObjectURL(preview);
		}
	};

	const triggerFileInput = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	

	return (
		<div className="space-y-3">
			<PhotoCamera handleAddPhoto={handleAddPhoto} />
			<div className="grid grid-cols-3 gap-2">
				{photos.map((photo, index) => (
					<div key={index} className="relative aspect-square">
						<img
							src={photo || "/placeholder.svg"}
							alt={`Foto ${index + 1}`}
							className="w-full h-full object-cover rounded-md"
						/>
						<button
							className="absolute top-1 right-1 bg-black/70 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
							onClick={() => handleRemovePhoto(index)}
						>
							×
						</button>
					</div>
				))}

				{uploadMutation.isPending && previewUrl && (
					<div className="relative aspect-square">
						<img
							src={previewUrl}
							alt="Uploading..."
							className="w-full h-full object-cover rounded-md opacity-50"
						/>
						<div className="absolute inset-0 flex items-center justify-center">
							<Loader2 className="h-6 w-6 animate-spin" />
						</div>
					</div>
				)}

				<button
					onClick={triggerFileInput}
					disabled={uploadMutation.isPending}
					className="aspect-square flex flex-col gap-2 border-2 border-dashed border-muted-foreground/30 rounded-md  items-center justify-center text-muted-foreground disabled:opacity-50"
				>
					<UploadCloud className="h-6 w-6" />
					<p className="text-xs">Subir foto</p>
				</button>
			</div>

			<input
				ref={fileInputRef}
				type="file"
				accept="image/*"
				capture="environment"
				onChange={handleFileChange}
				className="hidden"
			/>

			<p className="text-xs text-muted-foreground text-center">Toma fotos de la entrega</p>
			<div className="flex justify-center">
				<Button variant="outline" onClick={() => navigate("/delivery/signature")}>
					Continuar Entrega
				</Button>
			</div>
		</div>
	);
}
