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
        <Dialog open={open} onClose={onCancel}>
            <DialogTitle sx={{ fontSize: '1.2rem' }}><strong>{title || 'Delete'}</strong></DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ fontSize: '1rem' }}>{content || 'Are you sure you want to proceed?'}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel} color="inherit">
                    No
                </Button>
                <Button onClick={onConfirm} variant="contained" color="error">
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteConfirm;