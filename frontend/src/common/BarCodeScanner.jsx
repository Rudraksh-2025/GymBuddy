import { BrowserMultiFormatReader } from "@zxing/browser";
import { useEffect, useRef } from "react";
import CloseIcon from "@mui/icons-material/Close";

const BarCodeScanner = ({ onClose, onDetected }) => {
    const videoRef = useRef(null);

    useEffect(() => {
        const codeReader = new BrowserMultiFormatReader();

        codeReader.decodeFromVideoDevice(
            null,
            videoRef.current,
            (result, err) => {
                if (result) {
                    onDetected(result.getText());
                    onClose();
                }
            }
        );

        return () => codeReader.reset();
    }, []);

    return (
        <div style={styles.overlay}>
            {/* Header */}
            <div style={styles.header}>
                <button onClick={onClose} style={styles.closeBtn}>
                    <CloseIcon sx={{ color: "#fff" }} />
                </button>
                <span>Scan a Barcode</span>
            </div>

            {/* Camera */}
            <video ref={videoRef} style={styles.video} autoPlay playsInline />

            {/* Focus Box */}
            <div style={styles.box}>
                <span style={styles.cornerTL} />
                <span style={styles.cornerTR} />
                <span style={styles.cornerBL} />
                <span style={styles.cornerBR} />
            </div>

            {/* Manual Input */}
            <div style={styles.manual}>
                Manually enter barcode
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: "fixed",
        inset: 0,
        background: "#000",
        zIndex: 9999,
    },
    header: {
        position: "absolute",
        top: 0,
        width: "100%",
        height: 60,
        background: "#111",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 18,
    },
    closeBtn: {
        position: "absolute",
        left: 10,
        background: "none",
        border: "none",
    },
    video: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
    },
    box: {
        position: "absolute",
        top: "50%",
        left: "50%",
        width: 250,
        height: 250,
        transform: "translate(-50%, -50%)",
    },
    corner: {
        position: "absolute",
        width: 30,
        height: 30,
        borderColor: "#4F8EF7",
    },
    cornerTL: { top: 0, left: 0, borderLeft: "4px solid", borderTop: "4px solid" },
    cornerTR: { top: 0, right: 0, borderRight: "4px solid", borderTop: "4px solid" },
    cornerBL: { bottom: 0, left: 0, borderLeft: "4px solid", borderBottom: "4px solid" },
    cornerBR: { bottom: 0, right: 0, borderRight: "4px solid", borderBottom: "4px solid" },
    manual: {
        position: "absolute",
        bottom: 30,
        width: "100%",
        textAlign: "center",
        color: "#ddd",
        fontSize: 14,
    },
};

export default BarCodeScanner;

