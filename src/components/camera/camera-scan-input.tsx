import { useZxing } from "react-zxing";
import { useMediaDevices } from "react-media-devices";
import { useSound } from "use-sound";
import scanSound from "../../success-beep.mp3";
import { Lightbulb, LightbulbOff } from "lucide-react";
import { Button } from "@/components/ui/button";
const constraints: MediaStreamConstraints = {
	audio: false,
	video: {
		facingMode: "environment",
		width: { ideal: 1280 },
		height: { ideal: 720 },
		aspectRatio: { ideal: 1.777777778 },
		frameRate: { ideal: 30 },
	},
};

interface CameraScanProps {
	onScan: (hbl: string) => void;
	isLoading: boolean;
}

export const CameraScan = ({ onScan, isLoading }: CameraScanProps): JSX.Element => {
	const { devices } = useMediaDevices({
		constraints,
	});
	const [play] = useSound(scanSound);

	const deviceId = devices?.[0]?.deviceId;

	const {
		ref,
		torch: { on: torchOn, off: torchOff, isOn: isTorchOn, isAvailable: isTorchAvailable },
	} = useZxing({
		deviceId: deviceId,
		onDecodeResult: (result) => {
			if (!isLoading) {
				onScan(result.getText());
				play();
			}
		},

		constraints,
		timeBetweenDecodingAttempts: 600,
	});

	const handleTorchToggle = async () => {
		try {
			if (isTorchOn) {
				await torchOff();
			} else {
				await torchOn();
			}
		} catch (error) {
			console.error("Failed to toggle torch:", error);
		}
	};

	return (
		<div className=" relative h-[33vh] rounded-md overflow-hidden">
			<video ref={ref} className="w-full h-full  object-cover" autoPlay playsInline />
			<div className="absolute inline-flex items-center gap-2 bottom-2 z-10 right-2">
				<Button variant="ghost" size="icon" onClick={handleTorchToggle}>
					{isTorchAvailable ? (
						<Lightbulb className="w-4 h-4" />
					) : (
						<LightbulbOff className="w-4 h-4 text-muted-foreground" />
					)}
				</Button>
			</div>
		</div>
	);
};
