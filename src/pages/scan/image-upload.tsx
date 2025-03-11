import type React from "react";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { AlertCircle, Camera, Upload } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ImageUploadPage() {
	const [image, setImage] = useState<File | null>(null);
	const [preview, setPreview] = useState<string | null>(null);
	const [isUploading, setIsUploading] = useState(false);
	const [uploadStatus, setUploadStatus] = useState<{
		success: boolean;
		message: string;
	} | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const cameraInputRef = useRef<HTMLInputElement>(null);
	const [eventsIds, setEventsIds] = useState<number[]>([2375,2376]);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const selectedFile = e.target.files[0];
			setImage(selectedFile);

			// Create preview
			const reader = new FileReader();
			reader.onload = (event) => {
				setPreview(event.target?.result as string);
			};
			reader.readAsDataURL(selectedFile);

			// Reset status
			setUploadStatus(null);
		}
	};

	const handleUpload = async () => {
		if (!image) return;

		setIsUploading(true);
		setUploadStatus(null);

		try {
			const formData = new FormData();
			formData.append("file", image);
			formData.append("eventsIds", eventsIds);

			// Replace with your actual API endpoint
			const response = await fetch("http://localhost:3001/api/v1/images/upload-images", {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				throw new Error(`Upload failed with status: ${response.status}`);
			}

			const data = await response.json();

			setUploadStatus({
				success: true,
				message: "Image uploaded successfully!",
			});
		} catch (error) {
			console.error("Upload error:", error);
			setUploadStatus({
				success: false,
				message: error instanceof Error ? error.message : "Failed to upload image",
			});
		} finally {
			setIsUploading(false);
		}
	};

	const triggerFileInput = () => {
		fileInputRef.current?.click();
	};

	const triggerCameraInput = () => {
		cameraInputRef.current?.click();
	};

	return (
		<div className="container mx-auto py-10 px-4">
			<Card className="max-w-md mx-auto">
				<CardHeader>
					<CardTitle>Image Upload</CardTitle>
					<CardDescription>Take a picture or select an image to upload to your API</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{preview && (
						<div className="aspect-video relative rounded-md overflow-hidden border">
							<img
								src={preview || "/placeholder.svg"}
								alt="Preview"
								className="w-full h-full object-contain"
							/>
						</div>
					)}

					<div className="grid grid-cols-2 gap-4">
						<Button variant="outline" className="w-full" onClick={triggerCameraInput} type="button">
							<Camera className="mr-2 h-4 w-4" />
							Take Photo
						</Button>
						<Button variant="outline" className="w-full" onClick={triggerFileInput} type="button">
							<Upload className="mr-2 h-4 w-4" />
							Upload File
						</Button>
					</div>

					<input
						type="file"
						accept="image/*"
						onChange={handleFileChange}
						className="hidden"
						ref={fileInputRef}
					/>

					<input
						type="file"
						accept="image/*"
						capture="environment"
						onChange={handleFileChange}
						className="hidden"
						ref={cameraInputRef}
					/>

					{uploadStatus && (
						<Alert variant={uploadStatus.success ? "default" : "destructive"}>
							<AlertCircle className="h-4 w-4" />
							<AlertTitle>{uploadStatus.success ? "Success" : "Error"}</AlertTitle>
							<AlertDescription>{uploadStatus.message}</AlertDescription>
						</Alert>
					)}
				</CardContent>
				<CardFooter>
					<Button className="w-full" onClick={handleUpload} disabled={!image || isUploading}>
						{isUploading ? "Uploading..." : "Send to API"}
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
