import { Box, Typography, IconButton, Divider, Grid } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const MealSection = ({ title, onAddFood, data = [], onDeleteFood }) => {
  const mealTotal = data.reduce((sum, item) => sum + (item.calories || 0), 0);

  return (
    <Box
      sx={{
        p: 2,
        mb: 2,
        borderRadius: "18px",
        position: "relative",
        overflow: "hidden",

        /* Glass surface */
        background: "rgba(255,255,255,0.08)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        border: "1px solid rgba(255,255,255,0.18)",

        boxShadow: `
          inset 0 0 0.5px rgba(255,255,255,0.6),
          0 8px 28px rgba(0,0,0,0.35)
        `,
        color: "white",
      }}
    >
      {/* glossy highlight */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(120deg, rgba(255,255,255,0.18), transparent 60%)",
          pointerEvents: "none",
        }}
      />

      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Typography sx={{ fontWeight: 600 }}>{title}</Typography>

          <Typography sx={{ fontWeight: 600, fontSize: "13px", opacity: 0.8 }}>
            ({mealTotal} kcal)
          </Typography>
        </Box>

        <Typography
          onClick={onAddFood}
          sx={{
            fontWeight: 600,
            fontSize: "13px",
            cursor: "pointer",
            color: "#8B5CF6",
            "&:hover": { textDecoration: "underline" },
          }}
        >
          ADD FOOD
        </Typography>
      </Box>

      <Divider sx={{ my: 1.5, borderColor: "rgba(255,255,255,0.12)" }} />

      {/* FOOD LOG LIST */}
      {data.length > 0 ? (
        <Box sx={{ position: "relative", zIndex: 1 }}>
          {data.map((item, idx) => (
            <Box key={item._id}>
              <Grid
                container
                alignItems="center"
                py={1}
              >
                {/* LEFT */}
                <Grid
                  size={{ xs: 7 }}
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: { xs: 0.5, sm: 2 },
                    alignItems: { xs: "flex-start", sm: "center" },
                  }}
                >
                  <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.9)",
                        boxShadow: "0 0 6px rgba(255,255,255,0.8)",
                      }}
                    />
                    <Typography sx={{ fontWeight: 500, fontSize: "14px" }}>
                      {item.foodId?.name || "Food"} ({item.quantity || 1})
                    </Typography>
                  </Box>

                  <Typography sx={{ fontSize: "12px", opacity: 0.7 }}>
                    Protein {item.protein} g • Carbs {item.carbs} g • Fats{" "}
                    {item.fats} g
                  </Typography>
                </Grid>

                {/* RIGHT */}
                <Grid
                  size={{ xs: 5 }}
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Typography sx={{ fontWeight: 600 }}>
                    {item.calories} kcal
                  </Typography>

                  <IconButton
                    onClick={() => onDeleteFood(item._id)}
                    sx={{
                      color: "#F87171",
                      "&:hover": {
                        background: "rgba(248,113,113,0.15)",
                      },
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Grid>
              </Grid>

              {idx !== data.length - 1 && (
                <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />
              )}
            </Box>
          ))}
        </Box>
      ) : (
        <Typography
          onClick={onAddFood}
          sx={{
            fontWeight: 600,
            cursor: "pointer",
            fontSize: "14px",
            opacity: 0.6,
            "&:hover": { textDecoration: "underline", opacity: 0.9 },
            position: "relative",
            zIndex: 1,
          }}
        >
          No Data Found
        </Typography>
      )}
    </Box>
  );
};

export default MealSection;
