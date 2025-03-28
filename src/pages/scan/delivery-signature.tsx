import { useRef, useState, useEffect } from "react";

// Componente para capturar firma
interface SignatureCaptureProps {
	value: string;
	onChange: (value: string) => void;
}

export default function SignatureCapture({ value, onChange }: SignatureCaptureProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [isDrawing, setIsDrawing] = useState(false);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		// Configurar el canvas
		ctx.lineWidth = 3;
		ctx.lineCap = "round";
		ctx.strokeStyle = "#000";

		// Si hay una firma guardada, cargarla
		if (value) {
			const img = new Image();
			img.onload = () => {
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				ctx.drawImage(img, 0, 0);
			};
			img.src = value;
		}
	}, [value]);

	const startDrawing = (
		e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
	) => {
		setIsDrawing(true);
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const rect = canvas.getBoundingClientRect();
		let clientX, clientY;

		if ("touches" in e) {
			clientX = e.touches[0].clientX;
			clientY = e.touches[0].clientY;
			e.preventDefault(); // Prevenir scroll en dispositivos táctiles
		} else {
			clientX = e.clientX;
			clientY = e.clientY;
		}

		ctx.beginPath();
		ctx.moveTo(clientX - rect.left, clientY - rect.top);
	};

	const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
		if (!isDrawing) return;

		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const rect = canvas.getBoundingClientRect();
		let clientX, clientY;

		if ("touches" in e) {
			clientX = e.touches[0].clientX;
			clientY = e.touches[0].clientY;
			e.preventDefault(); // Prevenir scroll en dispositivos táctiles
		} else {
			clientX = e.clientX;
			clientY = e.clientY;
		}

		ctx.lineTo(clientX - rect.left, clientY - rect.top);
		ctx.stroke();
	};

	const stopDrawing = () => {
		setIsDrawing(false);

		const canvas = canvasRef.current;
		if (!canvas) return;

		// Ensure onChange is defined before calling it
		if (typeof onChange === "function") {
			const dataUrl = canvas.toDataURL("image/png");
			onChange(dataUrl);
		} else {
			console.warn("onChange handler is not provided to SignatureCapture component");
		}
	};

	const clearSignature = () => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		ctx.clearRect(0, 0, canvas.width, canvas.height);
		// Ensure onChange is defined before calling it
		if (typeof onChange === "function") {
			onChange("");
		}
	};

	return (
		<div className="space-y-3">
			<div className="border rounded-md bg-white">
				<canvas
					ref={canvasRef}
					width={300}
					height={150}
					className="w-full touch-none"
					onMouseDown={startDrawing}
					onMouseMove={draw}
					onMouseUp={stopDrawing}
					onMouseLeave={stopDrawing}
					onTouchStart={startDrawing}
					onTouchMove={draw}
					onTouchEnd={stopDrawing}
				/>
			</div>

			<div className="flex justify-center">
				<button onClick={clearSignature} className="text-sm text-muted-foreground underline">
					Borrar firma
				</button>
			</div>

			<p className="text-xs text-muted-foreground text-center">
				Firma del cliente que recibe los paquetes
			</p>
		</div>
	);
}
