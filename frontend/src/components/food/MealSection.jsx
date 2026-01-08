import { Box, Typography, IconButton, Divider } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

const MealSection = ({ title, onAddFood, data = [] }) => {
    return (
        <Box
            sx={{
                background: "linear-gradient(180deg, #1F2430 0%, #181C25 100%)",
                borderRadius: "14px",
                p: 2,
                mb: 2,
            }}
        >
            {/* Header */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography sx={{ color: "#E5E7EB", fontWeight: 600 }}>
                    {title}
                </Typography>

                {/* <IconButton size="small">
                    <MoreHorizIcon sx={{ color: "#9CA3AF" }} />
                </IconButton> */}
                <Typography
                    onClick={onAddFood}
                    sx={{
                        color: "#3B82F6",
                        fontWeight: 600,
                        cursor: "pointer",
                        fontSize: "14px",
                        mb: data.length ? 1.5 : 0,
                        "&:hover": { textDecoration: "underline" },
                    }}
                >
                    ADD FOOD
                </Typography>
            </Box>

            <Divider sx={{ my: 1.5, borderColor: "#2D3342" }} />

            {/* Add Food */}


            {/* FOOD LOG LIST */}
            {data.length > 0 ? (
                <Box>
                    {data.map((item, idx) => (
                        <Box key={item._id}>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    py: 1,
                                }}
                            >
                                {/* LEFT: FOOD NAME + MACROS */}
                                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center' }}>
                                    <Typography sx={{ color: "#F9FAFB", fontWeight: 500, fontSize: "14px" }}>
                                        {item.foodId?.name || "Food"}
                                    </Typography>

                                    <Typography sx={{ color: "#9CA3AF", fontSize: "12px" }}>
                                        Protein {item.protein} g • Carbs {item.carbs} g • Fats {item.fats} g
                                    </Typography>
                                </Box>

                                {/* RIGHT: CALORIES + MENU */}
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <Typography sx={{ color: "#F9FAFB", fontWeight: 600 }}>
                                        {item.calories} kcal
                                    </Typography>
                                </Box>
                            </Box>

                            {idx !== data.length - 1 && (
                                <Divider sx={{ borderColor: "#2D3342" }} />
                            )}
                        </Box>
                    ))}
                </Box>
            ) : (
                <Typography
                    onClick={onAddFood}
                    sx={{
                        color: "gray",
                        fontWeight: 600,
                        cursor: "pointer",
                        fontSize: "14px",
                        mb: data.length ? 1.5 : 0,
                        "&:hover": { textDecoration: "underline" },
                    }}
                >
                    No Data Found
                </Typography>
            )}
        </Box>
    );
};

export default MealSection;
