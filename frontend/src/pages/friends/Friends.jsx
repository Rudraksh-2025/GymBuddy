import React, { useState } from "react";
import {
    Box, Grid, TextField,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Avatar,
    Chip, Button, TableContainer,
    LinearProgress, InputAdornment
} from "@mui/material";
import PodiumCard from "../../components/friends/PodiumCard";
import AddIcon from "@mui/icons-material/Add";
import search2 from '../../assets/images/search2.svg'
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import AddFriendDialog from "../../components/friends/AddFriendDailog";
import { useGetFriendsLeaderboard } from "../../Api/Api";

const rankColor = {
    Beginner: "#9CA3AF",
    Rookie: "#60A5FA",
    Warrior: "#34D399",
    Beast: "#F97316",
    Elite: "#EF4444",
};
const handleGlowMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - rect.top}px`);
};

const Friends = () => {
    const [search, setSearch] = useState('')
    const [openAddFriend, setOpenAddFriend] = useState(false);
    const FriendCode = JSON.parse(localStorage.getItem('friendCode'))

    const { data: friendsLeaderboard, isLoading } = useGetFriendsLeaderboard();

    const podiumData = friendsLeaderboard?.data?.podium || [];
    const leaderboardData = friendsLeaderboard?.data?.leaderboard || [];

    return (
        <Box sx={{ p: { xs: 0, sm: 2 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Typography sx={{ color: 'white', fontWeight: 600, border: '1px solid white', p: 1, borderRadius: '8px' }}>Your code : {FriendCode}</Typography>
            </Box>
            <PodiumCard data={podiumData} />
            <Box
                className='glass-container'
                onMouseMove={handleGlowMove}
                sx={{
                    // mt: 2,
                    borderRadius: "10px",
                    position: "relative",
                    overflow: "hidden",
                    color: "white",
                }}
            >
                {/* glossy highlight */}
                <Box
                    className='glass-layer'
                />
                <Grid
                    container
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ p: { xs: 2 }, position: "relative", zIndex: 1 }}
                >
                    <Grid
                        size={{ xs: 12, md: 5 }}
                        sx={{ display: "flex", flexDirection: "row", gap: 2, mb: { xs: 1, md: 0 } }}
                    >
                        <Typography variant="h6" fontWeight={600}>
                            Friends Leaderboard 🏆
                        </Typography>
                    </Grid>

                    <Grid
                        size={{ xs: 12, md: 7 }}
                        sx={{ display: "flex", justifyContent: { xs: "flex-start", sm: "flex-end" }, gap: 2 }}
                    >
                        <TextField
                            variant="outlined"
                            placeholder="Search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            fullWidth
                            sx={{
                                width: '100%',
                                height: '40px',
                                borderRadius: '8px',
                                '& .MuiInputBase-root': {
                                    height: '40px',
                                    fontSize: '14px',
                                    color: 'white'
                                },
                                '& .MuiOutlinedInput-input': {
                                    padding: '10px 14px',
                                },
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'var(--light-gray)',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'var(--light-gray)',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'var(--light-gray)',
                                    },
                                },
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <img src={search2} alt="search icon" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Button
                            onClick={() => setOpenAddFriend(true)}
                            startIcon={<AddIcon />}
                            className="glass-btn"
                            sx={{
                                whiteSpace: "nowrap",
                                minWidth: "auto",
                            }}
                        >
                            Add Friend
                        </Button>

                    </Grid>
                </Grid>
                <Box sx={{ position: "relative", zIndex: 1 }}>
                    {isLoading ? (
                        <Typography align="center" sx={{ mt: 1, pb: 2, opacity: 0.7 }}>
                            Loading...
                        </Typography>
                    ) : Array.isArray(leaderboardData) && leaderboardData?.length > 0 ? (
                        <TableContainer
                            sx={{
                                backgroundColor: "transparent",
                                boxShadow: "none",
                                overflowX: "auto",
                                WebkitOverflowScrolling: "touch",
                            }}
                        >
                            <Table
                                sx={{
                                    backgroundColor: "transparent",
                                    "& .MuiTableCell-root": {
                                        fontSize: "15px",
                                        color: "white",
                                        backgroundColor: "transparent",
                                    },
                                }}
                            >
                                <TableHead>
                                    <TableRow
                                        sx={{
                                            background: "rgba(255,255,255,0.08)",
                                            backdropFilter: "blur(10px)",
                                        }}
                                    >
                                        <TableCell>#</TableCell>
                                        <TableCell>User</TableCell>
                                        <TableCell>Rank</TableCell>
                                        <TableCell>XP</TableCell>
                                        <TableCell>Streak</TableCell>
                                        <TableCell>Last Workout</TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {leaderboardData?.map((u, index) => (
                                        <TableRow
                                            key={u.id}
                                            sx={{
                                                "&:last-child td, &:last-child th": {
                                                    borderBottom: "none",
                                                },
                                                "&:hover": { background: "rgba(255,255,255,0.05)" },
                                            }}
                                        >
                                            {/* Rank */}
                                            <TableCell>
                                                {index < 3 ? (
                                                    <EmojiEventsIcon
                                                        sx={{
                                                            color:
                                                                index === 0
                                                                    ? "#FACC15"
                                                                    : index === 1
                                                                        ? "#E5E7EB"
                                                                        : "#D97706",
                                                        }}
                                                    />
                                                ) : (
                                                    index + 1
                                                )}
                                            </TableCell>

                                            {/* User */}
                                            <TableCell>
                                                <Box display="flex" alignItems="center" gap={1}>
                                                    <Avatar sx={{ bgcolor: "#6366F1" }}>
                                                        {u.name[0]}
                                                    </Avatar>
                                                    <Typography fontWeight={600}>
                                                        {u.name} {u.isYou && "(You)"}
                                                    </Typography>
                                                </Box>
                                            </TableCell>

                                            {/* Rank Badge */}
                                            <TableCell>
                                                <Chip
                                                    label={u.rank}
                                                    sx={{
                                                        bgcolor: rankColor[u.rank],
                                                        color: "white",
                                                        fontWeight: 600,
                                                    }}
                                                />
                                            </TableCell>

                                            {/* XP */}
                                            <TableCell>
                                                <Typography fontWeight={600}>{u.xp}</Typography>
                                            </TableCell>

                                            {/* Streak */}
                                            <TableCell>
                                                <Box display="flex" alignItems="center" gap={0.5}>
                                                    <WhatshotIcon sx={{ color: "#F97316" }} />
                                                    <Typography>{u.streak} days</Typography>
                                                </Box>
                                            </TableCell>

                                            {/* Last Workout */}
                                            <TableCell>
                                                <Box display="flex" alignItems="center" gap={0.5}>
                                                    <FitnessCenterIcon fontSize="small" />
                                                    <Typography fontSize={14}>
                                                        {u.lastWorkout || "—"}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : (
                        <Typography align="center" sx={{ mt: 1, pb: 2, opacity: 0.7 }}>
                            No data found
                        </Typography>
                    )}
                    <AddFriendDialog
                        open={openAddFriend}
                        onClose={() => setOpenAddFriend(false)}
                    />

                </Box>
            </Box>
        </Box>
    );
};

export default Friends;
