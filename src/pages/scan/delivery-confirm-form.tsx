import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { AlertCircle, Camera, Upload, Pen, RefreshCw, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

export default function DeliveryConfirmationForm() {
	// Package details state
	const [packageDetails, setPackageDetails] = useState({
		trackingNumber: "",
		description: "",
		quantity: "1",
	});

	// Photo state
	const [image, setImage] = useState<File | null>(null);
	const [preview, setPreview] = useState<string | null>(null);

	// Signature state
	const [signature, setSignature] = useState<string | null>(null);
	const [isDrawing, setIsDrawing] = useState(false);

	// Form submission state
	const [isUploading, setIsUploading] = useState(false);
	const [uploadStatus, setUploadStatus] = useState<{
		success: boolean;
		message: string;
	} | null>(null);

	// Refs
	const fileInputRef = useRef<HTMLInputElement>(null);
	const cameraInputRef = useRef<HTMLInputElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);

	// Initialize canvas when component mounts
	useEffect(() => {
		const canvas = canvasRef.current;
		if (canvas) {
			const ctx = canvas.getContext("2d");
			if (ctx) {
				ctx.lineWidth = 3;
				ctx.lineCap = "round";
				ctx.strokeStyle = "#000";
			}
		}
	}, []);

/* 	const handlePackageDetailsChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setPackageDetails((prev) => ({
			...prev,
			[name]: value,
		}));
	}; */

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
		// Validate package details
		if (!packageDetails.trackingNumber.trim()) {
			setUploadStatus({
				success: false,
				message: "Please enter a tracking number",
			});
			return;
		}

		// Validate photo or signature
		if (!image && !signature) {
			setUploadStatus({
				success: false,
				message: "Please provide a delivery photo or signature",
			});
			return;
		}

		setIsUploading(true);
		setUploadStatus(null);

		try {
			const formData = new FormData();

			// Add package details
			formData.append("trackingNumber", packageDetails.trackingNumber);
			formData.append("description", packageDetails.description);
			formData.append("quantity", packageDetails.quantity);

			// Add photo if available
			if (image) {
				formData.append("image", image);
			}

			// Add signature if available
			if (signature) {
				// Convert base64 signature to a file
				const signatureFile = await fetch(signature)
					.then((res) => res.blob())
					.then((blob) => new File([blob], "signature.png", { type: "image/png" }));

				formData.append("signature", signatureFile);
			}

			// Replace with your actual API endpoint
			const response = await fetch("https://your-api-endpoint.com/delivery-confirmation", {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				throw new Error(`Upload failed with status: ${response.status}`);
			}

			const data = await response.json();

			setUploadStatus({
				success: true,
				message: "Delivery confirmation submitted successfully!",
			});
		} catch (error) {
			console.error("Upload error:", error);
			setUploadStatus({
				success: false,
				message: error instanceof Error ? error.message : "Failed to submit delivery confirmation",
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

	// Signature pad functions
	const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
		setIsDrawing(true);
		draw(e);
	};

	const stopDrawing = () => {
		setIsDrawing(false);
		const canvas = canvasRef.current;
		if (canvas) {
			const ctx = canvas.getContext("2d");
			if (ctx) {
				ctx.beginPath();
			}
		}

		// Save signature as image
		if (canvasRef.current) {
			setSignature(canvasRef.current.toDataURL("image/png"));
		}
	};

	const draw = (e: React.MouseEvent | React.TouchEvent) => {
		if (!isDrawing) return;

		const canvas = canvasRef.current;
		const ctx = canvas?.getContext("2d");
		if (!ctx || !canvas) return;

		let clientX: number, clientY: number;

		// Handle both mouse and touch events
		if ("touches" in e) {
			// Touch event
			const touch = e.touches[0];
			const rect = canvas.getBoundingClientRect();
			clientX = touch.clientX - rect.left;
			clientY = touch.clientY - rect.top;
		} else {
			// Mouse event
			e.preventDefault();
			const rect = canvas.getBoundingClientRect();
			clientX = e.clientX - rect.left;
			clientY = e.clientY - rect.top;
		}

		ctx.lineTo(clientX, clientY);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(clientX, clientY);
	};

	const clearSignature = () => {
		const canvas = canvasRef.current;
		const ctx = canvas?.getContext("2d");
		if (ctx && canvas) {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			setSignature(null);
		}
	};

	return (
		<div className="container mx-auto py-10 px-4">
			<Card className="max-w-md mx-auto">
				<CardHeader>
					<CardTitle className="text-lg font-bold">Delivery Confirmation</CardTitle>
					<CardDescription>
						Confirm package delivery with details, photo, and signature
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* Photo Section */}
					<div className="space-y-4">
						<div className="flex items-center">
							<Camera className="mr-2 h-4 w-4" />
							<h3 className=" font-medium">Delivery Photo</h3>
						</div>

						{preview ? (
							<div className="aspect-video relative rounded-md overflow-hidden border">
								<img
									src={preview || "/placeholder.svg"}
									alt="Delivery preview"
									className="w-full h-full object-contain"
								/>
							</div>
						) : (
							<div className="aspect-video bg-muted flex items-center justify-center rounded-md border border-dashed">
								<p className="text-sm text-muted-foreground">No photo selected</p>
							</div>
						)}

						<div className="grid grid-cols-2 gap-4">
							<Button
								variant="outline"
								className="w-full"
								onClick={triggerCameraInput}
								type="button"
							>
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
					</div>

					<Separator />

					{/* Signature Section */}
					<div className="space-y-4">
						<div className="flex items-center">
							<Pen className="mr-2 h-4 w-4" />
							<h3 className=" font-medium">Client Signature</h3>
						</div>

						{/* Package receipt confirmation */}
						<div className="bg-muted p-3 rounded-md text-sm">
							<p className="font-medium mb-1">Confirmation of Receipt</p>
							<p>
								I confirm that I have received the package with tracking number
								<span className="font-semibold">
									{" "}
									{packageDetails.trackingNumber || "[Tracking Number]"}
								</span>
								{packageDetails.description && (
									<span>
										{" "}
										described as:{" "}
										<span className="font-semibold">{packageDetails.description}</span>
									</span>
								)}
								{packageDetails.quantity && packageDetails.quantity !== "1" && (
									<span>
										{" "}
										(Quantity: <span className="font-semibold">{packageDetails.quantity}</span>)
									</span>
								)}
							</p>
						</div>

						<div className=" rounded-md p-1">
							<Label htmlFor="signature-pad" className="text-sm text-muted-foreground mb-2 block">
								Sign below to confirm receipt of package
							</Label>
							<div className="relative  rounded-md bg-white touch-none ">
								<canvas
									ref={canvasRef}
									width={450}
									height={150}
									className="w-full h-[150px] cursor-crosshair touch-none"
									onMouseDown={startDrawing}
									onMouseMove={draw}
									onMouseUp={stopDrawing}
									onMouseLeave={stopDrawing}
									onTouchStart={startDrawing}
									onTouchMove={draw}
									onTouchEnd={stopDrawing}
								/>
							</div>
						</div>
						<div className="flex justify-between items-center">
							<div>
								{signature && (
									<div className="text-sm text-green-600 flex items-center">
										<CheckCircle2 className="mr-1 h-4 w-4" />
										Signature captured
									</div>
								)}
							</div>
							<Button variant="outline" size="sm" onClick={clearSignature}>
								<RefreshCw className="mr-2 h-4 w-4" />
								Clear Signature
							</Button>
						</div>
					</div>

					{uploadStatus && (
						<Alert variant={uploadStatus.success ? "default" : "destructive"}>
							<AlertCircle className="h-4 w-4" />
							<AlertTitle>{uploadStatus.success ? "Success" : "Error"}</AlertTitle>
							<AlertDescription>{uploadStatus.message}</AlertDescription>
						</Alert>
					)}
				</CardContent>
				<CardFooter>
					<Button className="w-full" onClick={handleUpload} disabled={isUploading}>
						{isUploading ? "Submitting..." : "Confirm Delivery"}
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
