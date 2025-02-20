import { useZxing } from "react-zxing";
import { useSound } from "use-sound";
import scanSound from "../../success-beep.mp3";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface CameraScanProps {
	onScan: (hbl: string) => void;
	isLoading: boolean;
}

export const CameraScan = ({ onScan, isLoading }: CameraScanProps): JSX.Element => {
	const [play] = useSound(scanSound);
	const [isSuccess, setIsSuccess] = useState(false);

	const { ref } = useZxing({
		onDecodeResult: (result) => {
			if (!isLoading) {
				setIsSuccess(true);
				onScan(result.getText());
				play();
				setTimeout(() => setIsSuccess(false), 1000);
			}
		},
		constraints: {
			video: {
				facingMode: "environment",
				width: { ideal: window.innerWidth },
				height: { ideal: window.innerHeight / 3 },
			},
		},
	});

	return (
		<div className="h-[33vh] relative overflow-hidden bg-black/90">
			<video ref={ref} className="w-full h-full object-cover opacity-80" />

			{/* QR Frame */}
			<div
				className={cn(
					"absolute inset-0 flex items-center justify-center",
					isSuccess && "animate-pulse",
				)}
			>
				<div className="relative w-48 h-48">
					{/* Transparent center */}
					<div className="absolute inset-0 bg-black/50" />
					<div className="absolute inset-4 border-2 border-dashed border-white/30" />

					{/* Corner markers */}
					<div className="absolute -inset-0.5">
						<div className="absolute top-0 left-0 w-6 h-6">
							<div className="absolute inset-0 border-l-4 border-t-4 border-white" />
						</div>
						<div className="absolute top-0 right-0 w-6 h-6">
							<div className="absolute inset-0 border-r-4 border-t-4 border-white" />
						</div>
						<div className="absolute bottom-0 left-0 w-6 h-6">
							<div className="absolute inset-0 border-l-4 border-b-4 border-white" />
						</div>
						<div className="absolute bottom-0 right-0 w-6 h-6">
							<div className="absolute inset-0 border-r-4 border-b-4 border-white" />
						</div>
					</div>

					{/* Success indicator */}
					{isSuccess && (
						<div className="absolute inset-0 border-4 border-green-500 animate-pulse" />
					)}
				</div>
			</div>
		</div>
	);
};
