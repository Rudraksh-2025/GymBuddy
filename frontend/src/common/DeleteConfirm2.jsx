import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button
} from '@mui/material';

const DeleteConfirm = ({ open, title, content, onConfirm, onCancel }) => {
    return (
        <Dialog open={open} onClose={onCancel}
            fullWidth
            maxWidth="xs"
            BackdropProps={{
                sx: {
                    backdropFilter: "blur(4px)",
                    backgroundColor: "rgba(0,0,0,0.55)",
                },
            }}
            PaperProps={{
                sx: {
                    borderRadius: "22px",
                    position: "relative",
                    overflow: "hidden",
                    /* Glass paper */
                    background: "rgba(30,30,40,0.88)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    border: "1px solid rgba(255,255,255,0.18)",
                    boxShadow: `inset 0 0 0.5px rgba(255,255,255,0.6),
                    0 20px 60px rgba(0,0,0,0.6)`,
                    color: "white",
                },
            }}
        >
            <DialogTitle sx={{ fontSize: '1.2rem' }}><strong>{title || 'Delete'}</strong></DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ fontSize: '1rem', color: 'white' }}>{content || 'Are you sure you want to proceed?'}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel} color="inherit">
                    No
                </Button>
                <Button onClick={onConfirm} sx={{ width: '100px' }} className='purple-glosy-btn'>
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteConfirm;