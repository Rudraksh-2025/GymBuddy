import BarcodeScannerComponent from "react-qr-barcode-scanner";

const BarCodeScanner = ({ onDetected }) => {
    return (
        <BarcodeScannerComponent
            width={300}
            height={300}
            onUpdate={(err, result) => {
                if (result) {
                    onDetected(result.text); // barcode number
                }
            }}
        />
    );
};

export default BarCodeScanner;
