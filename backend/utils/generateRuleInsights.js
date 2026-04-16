export const generateRuleInsights = ({
    goal,
    todayFood,
    weeklyWorkoutCount,
    streak,
}) => {
    const insights = [];

    // 🔴 Low Protein
    if (todayFood.protein < goal.protein * 0.6) {
        insights.push({
            type: "nutrition",
            title: "Low Protein Intake",
            message: "Add paneer, curd, tofu, or dal to increase protein today.",
            priority: "high",
        });
    }

    // 🟠 Calories Over
    if (todayFood.calories > goal.calories * 1.1) {
        insights.push({
            type: "nutrition",
            title: "High Calories Today",
            message: "Try lighter dinner and more vegetables tonight.",
            priority: "medium",
        });
    }

    // 🔴 No workouts
    if (weeklyWorkoutCount === 0) {
        insights.push({
            type: "workout",
            title: "No Workouts This Week",
            message: "Start with a 20–30 min light workout today.",
            priority: "high",
        });
    }


    return insights;
};
