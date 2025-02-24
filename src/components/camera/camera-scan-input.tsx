import { useZxing } from "react-zxing";
import { useMediaDevices } from "react-media-devices";
import { useSound } from "use-sound";
import scanSound from "../../success-beep.mp3";

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

	const { ref } = useZxing({
		deviceId: deviceId,
		onDecodeResult: (result) => {
			if (!isLoading) {
				onScan(result.getText());
				play();
			}
		},
		constraints,
		timeBetweenDecodingAttempts: 100,
	});

	return (
		<div>
			<div className=" h-[33vh] ">
				<video ref={ref} className="w-full h-full  object-cover" autoPlay playsInline />
			</div>
		</div>
	);
};
