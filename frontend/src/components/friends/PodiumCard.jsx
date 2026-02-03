import { Box, Typography, Avatar, Chip } from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

const podiumConfig = [
    { place: 2, height: 100, color: "#E5E7EB" }, // Silver
    { place: 1, height: 140, color: "#FACC15" }, // Gold
    { place: 3, height: 80, color: "#D97706" }, // Bronze
];

const PodiumCard = ({ data }) => {
    const topThree = data.slice(0, 3);

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-end",
                gap: 3,
                mb: 4,
            }}
        >

            {podiumConfig.map((podium, idx) => {
                const user = topThree[podium.place - 1];
                if (!user) return null;

                return (
                    <Box
                        key={podium.place}
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            textAlign: "center",
                            width: '100%'
                        }}
                    >
                        {/* Trophy */}
                        <EmojiEventsIcon
                            sx={{
                                color: podium.color,
                                fontSize: podium.place === 1 ? 42 : 34,
                                mb: 0.5,
                            }}
                        />

                        {/* Avatar */}
                        <Avatar
                            sx={{
                                bgcolor: "#6366F1",
                                width: podium.place === 1 ? 54 : 44,
                                height: podium.place === 1 ? 54 : 44,
                                mb: 0.5,
                            }}
                        >
                            {user.name[0]}
                        </Avatar>

                        {/* Name */}
                        <Typography fontWeight={700} fontSize={14} sx={{ color: 'white' }}>
                            {user.name}
                        </Typography>

                        {/* Rank */}
                        <Chip
                            label={user.rank}
                            size="small"
                            sx={{
                                mt: 0.5,
                                bgcolor: "#00000055",
                                color: "white",
                                fontWeight: 600,
                            }}
                        />

                        {/* Podium Base */}
                        <Box
                            sx={{
                                mt: 1,
                                width: 90,
                                height: podium.height,
                                background:
                                    "linear-gradient(180deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))",
                                backdropFilter: "blur(10px)",
                                borderRadius: "12px 12px 6px 6px",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Typography fontWeight={700} sx={{ color: 'white' }}>{user.xp} XP</Typography>
                        </Box>

                        <Typography
                            sx={{ mt: 0.5, opacity: 0.7, fontSize: 13, color: 'white' }}
                        >
                            #{podium.place}
                        </Typography>
                    </Box>
                );
            })}
        </Box>
    );
};

export default PodiumCard;
