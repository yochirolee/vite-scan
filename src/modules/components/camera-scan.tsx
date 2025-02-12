import React, { useState } from 'react';
import { useZxing } from 'react-zxing';

interface CameraScanProps {
    onScan: (hbl: string) => void;
}

export const CameraScan = ({ onScan }: CameraScanProps) => {
    const [scanResult, setScanResult] = useState<string[] | null>(null);

    const { ref } = useZxing({
        onDecodeResult: (result) => {
            onScan(result.getText());
            setScanResult((prev) => [...(prev || []), result.getText()]);
        },
        constraints,
        timeBetweenDecodingAttempts: 300,
        formats: ["qr_code"] as const,
    });
    // ... rest of component
} 