import { useRef, useState, useEffect } from "react";



export default function SignatureCapture() {
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

		
	}, []);

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

		
	};

	const clearSignature = () => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		ctx.clearRect(0, 0, canvas.width, canvas.height);
		// Ensure onChange is defined before calling it
		
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
