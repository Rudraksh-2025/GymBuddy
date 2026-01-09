import { Box, Typography, IconButton, Divider, Grid } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const MealSection = ({ title, onAddFood, data = [], onDeleteFood }) => {
    const mealTotal = data.reduce((sum, item) => sum + (item.calories || 0), 0);
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

                <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                    <Typography sx={{ color: "#E5E7EB", fontWeight: 600 }}>
                        {title}
                    </Typography>
                    <Typography sx={{ color: "#F9FAFB", fontWeight: 600, fontSize: "14px" }}>
                        ( {mealTotal} kcal )
                    </Typography>
                </Box>

                <Typography
                    onClick={onAddFood}
                    sx={{
                        color: "#3B82F6",
                        fontWeight: 600,
                        cursor: "pointer",
                        fontSize: "14px",
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
                            <Grid
                                container
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    py: 1,
                                }}
                            >
                                {/* LEFT: FOOD NAME + MACROS */}
                                <Grid size={{ xs: 7 }} sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 0.5, sm: 2 }, alignItems: { xs: 'start', sm: 'center' } }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center' }}>
                                        <Box
                                            sx={{
                                                width: 8,
                                                height: 8,
                                                borderRadius: "50%",
                                                bgcolor: "white",
                                            }}
                                        />
                                        <Typography sx={{ color: "#F9FAFB", fontWeight: 500, fontSize: "14px" }}>
                                            {item.foodId?.name || "Food"}
                                            {` ( ${item.quantity} )` || "( 1 )"}
                                        </Typography>
                                    </Box>

                                    <Typography sx={{ color: "#9CA3AF", fontSize: "12px" }}>
                                        Protein {item.protein} g • Carbs {item.carbs} g • Fats {item.fats} g
                                    </Typography>
                                </Grid>

                                {/* RIGHT: CALORIES + MENU */}
                                <Grid size={{ xs: 5 }} sx={{ display: "flex", justifyContent: 'end', alignItems: "center", gap: 1 }}>
                                    <Typography sx={{ color: "#F9FAFB", fontWeight: 600 }}>
                                        {item.calories} kcal
                                    </Typography>
                                    <IconButton
                                        sx={{ color: 'red' }}
                                        onClick={() => onDeleteFood(item._id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>

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
