import { BrowserMultiFormatReader } from "@zxing/browser";
import { useEffect, useRef } from "react";
import CloseIcon from "@mui/icons-material/Close";

const BarCodeScanner = ({ onClose, onDetected }) => {
    const videoRef = useRef(null);
    const controlsRef = useRef(null);
    const closedRef = useRef(false);

    useEffect(() => {
        const codeReader = new BrowserMultiFormatReader();

        const startScan = async () => {
            controlsRef.current = await codeReader.decodeFromVideoDevice(
                null,
                videoRef.current,
                (result, err) => {
                    if (result && !closedRef.current) {
                        closedRef.current = true;
                        stopCamera();
                        onDetected(result.getText());
                        onClose();
                    }
                }
            );
        };

        startScan();

        return () => {
            stopCamera();
        };
    }, []);

    const stopCamera = () => {
        if (controlsRef.current) {
            controlsRef.current.stop();
            controlsRef.current = null;
        }
    };

    const handleClose = () => {
        closedRef.current = true;
        stopCamera();
        onClose();
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.header}>
                <button onClick={handleClose} style={styles.closeBtn}>
                    <CloseIcon sx={{ color: "#fff" }} />
                </button>
                <span>Scan a Barcode</span>
            </div>

            <video ref={videoRef} style={styles.video} autoPlay playsInline />

            <div style={styles.box}>
                <span style={styles.cornerTL} />
                <span style={styles.cornerTR} />
                <span style={styles.cornerBL} />
                <span style={styles.cornerBR} />
            </div>
        </div>
    );
};

export default BarCodeScanner;



const styles = {
    overlay: {
        position: "relative",
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
    cornerTL: { position: "absolute", top: 0, left: 0, borderLeft: "4px solid", borderTop: "4px solid" },
    cornerTR: { position: "absolute", top: 0, right: 0, borderRight: "4px solid", borderTop: "4px solid" },
    cornerBL: { position: "absolute", bottom: 0, left: 0, borderLeft: "4px solid", borderBottom: "4px solid" },
    cornerBR: { position: "absolute", bottom: 0, right: 0, borderRight: "4px solid", borderBottom: "4px solid" },
};