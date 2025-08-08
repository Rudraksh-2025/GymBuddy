import { useState } from 'react';
import {
    Box,
    Table,
    TableHead,
    TableBody,
    TableCell,
    TableRow,
    TableContainer,
    Paper,
    Typography,
    Button,
    Pagination,
    Switch, Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl, InputLabel, Select, MenuItem, Menu
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { Link } from 'react-router-dom'
import { useGetReports, useMarketPlaceStatus, useUpdateSubleaseStatus, useReportStatus } from '../../api/ApiCall';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';


export default function Report() {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [page, setPage] = useState(1);
    const [filter, setFilter] = useState('new');
    const [openReportDialog, setOpenReportDialog] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);
    const { data, isLoading, isError } = useGetReports(page, 7, filter);
    const { mutate: updateMarketStatus } = useMarketPlaceStatus();
    const { mutate: updateSubleaseStatus } = useUpdateSubleaseStatus();
    const { mutate: updateReportStatus } = useReportStatus();


    const Products = data?.paginatedData?.data || [];
    const client = useQueryClient()
    const totalPages = data?.paginatedData?.pagination?.totalPages || 1;
    if (isLoading) return <div>Loading Report Logs...</div>;
    if (isError) return <div>Error loading Report Logs.</div>


    // status toggle
    const handleStatusToggle = (id, isChecked, isMarketplace) => {
        const newStatus = !isChecked;
        if (isMarketplace) {
            updateMarketStatus(
                { productId: id, status: newStatus },
                {
                    onSuccess: () => {
                        client.invalidateQueries(['marketplace', id]);
                        toast.success(`Marketplace status ${newStatus ? 'Activated' : 'Suspended'}`);
                    },
                    onError: (error) => {
                        toast.error(error?.response?.data?.message || 'Something went wrong');
                    }
                }
            );
        } else {
            updateSubleaseStatus(
                { subleaseId: id, status: newStatus },
                {
                    onSuccess: () => {
                        client.invalidateQueries(['sublease', id]);
                        toast.success(`Sublease status ${newStatus ? 'Activated' : 'Suspended'}`);
                    },
                    onError: (error) => {
                        toast.error(error?.response?.data?.message || 'Something went wrong');
                    }
                }
            );
        }
    };

    // Report status toggle
    const handleReport = (id, isChecked) => {
        updateReportStatus(
            { reportId: id, body: { seen: isChecked }, },
            {
                onSuccess: () => {
                    client.invalidateQueries(['reports'], { exact: 'false' });
                },
                onError: (error) => {
                    toast.error(error?.response?.data?.message || 'Something went wrong');
                }
            }
        );
    }


    const handleOpenReport = (report) => {
        setSelectedReport(report);
        setOpenReportDialog(true);
    };

    const handleCloseReport = () => {
        if (selectedReport) {
            handleReport(selectedReport?.report_id, true);
        }
        setOpenReportDialog(false);
        setSelectedReport(null);
    };
    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);
    return (
        <Box p={1}>
            <Box display="flex" justifyContent="space-between" sx={{
                flexDirection: {
                    xs: 'column', sm: 'row'
                }
            }} mb={2}>
                <Typography variant="h3">Report Logs</Typography>
                <Box display={'flex'} flexDirection={'row'} sx={{
                    mt: { xs: 2, sm: 0 },
                    justifyContent: { xs: 'space-between', sm: 'flex-start' }
                }} gap={4}>
                    <Box display="flex" gap={1} >
                        <FormControl sx={{ minWidth: 200 }} size="medium">
                            <InputLabel>Type</InputLabel>
                            <Select
                                value={filter}
                                label="Type"
                                onChange={(e) => setFilter(e.target.value)}
                            >
                                <MenuItem value="suspend">Suspend</MenuItem>
                                <MenuItem value="new">New</MenuItem>
                                <MenuItem value="review">Review</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Box>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell><strong>ID</strong></TableCell>
                            <TableCell><strong>Title</strong></TableCell>
                            <TableCell><strong>University</strong></TableCell>
                            <TableCell><strong>Category</strong></TableCell>
                            <TableCell><strong>Price</strong></TableCell>
                            <TableCell><strong>Boosted</strong></TableCell>
                            <TableCell><strong>Seen</strong></TableCell>
                            <TableCell><strong>Suspend</strong></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Products.length > 0 ? (
                            Products.map((product) => {
                                const entry = product?.marketPlace || product?.sublease;
                                const isMarketplace = !!product?.marketPlace;
                                return (
                                    <TableRow key={product?.report_id}>
                                        <TableCell>{isMarketplace ? entry?.marketPlace_id : entry?.sublease_id ?? 'NA'}</TableCell>
                                        <TableCell>{entry?.title ?? 'NA'}</TableCell>
                                        <TableCell>{entry?.university ?? 'NA'}</TableCell>
                                        <TableCell>{entry?.category ?? 'NA'}</TableCell>
                                        <TableCell>{entry?.price ?? 'NA'}</TableCell>
                                        <TableCell>{entry?.isbootList ? 'Yes' : "No" ?? 'NA'}</TableCell>
                                        <TableCell>
                                            <Switch
                                                checked={product?.seen}
                                                onChange={(e) =>
                                                    handleReport(product?.report_id, e.target.checked)}
                                                color="primary"
                                            />

                                        </TableCell>
                                        <TableCell>
                                            <Switch
                                                checked={!entry?.status}
                                                onChange={(e) =>
                                                    handleStatusToggle(
                                                        isMarketplace ? entry?.marketPlace_id : entry?.sublease_id,
                                                        e.target.checked,
                                                        isMarketplace
                                                    )
                                                }
                                                color="primary"
                                            />

                                        </TableCell>
                                        <TableCell>
                                            {isMarketplace ? (
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    size="small"
                                                    component={Link}
                                                    to={`/dashboard/products/${entry?.marketPlace_id}`}
                                                >
                                                    View
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    size="small"
                                                    component={Link}
                                                    to={`/dashboard/sublease/${entry?.sublease_id}`}
                                                >
                                                    View
                                                </Button>
                                            )}
                                        </TableCell>


                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                onClick={() => {
                                                    handleOpenReport(product)
                                                }}
                                            >
                                                View Report
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={12} align="center">
                                    No Data found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openReportDialog} onClose={handleCloseReport} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontSize: '1.2rem' }}><strong>Report Details: </strong></DialogTitle>
                <DialogContent dividers>
                    <Typography variant="h5" sx={{ fontWeight: '500' }}> {selectedReport?.report_description}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseReport}>Close</Button>
                </DialogActions>
            </Dialog>

            {totalPages > 1 &&
                <Box display="flex" justifyContent="center" mt={2}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={(e, value) => setPage(value)}
                        color="primary"
                    />
                </Box>}
        </Box>
    );
}
