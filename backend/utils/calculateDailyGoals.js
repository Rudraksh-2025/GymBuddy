export const calculateDailyGoals = ({
    weight,
    height,
    age,
    gender,
    activityLevel,
    goalType,
}) => {
    // ---------- BMR ----------
    let bmr;

    if (gender === "male") {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    // ---------- ACTIVITY MULTIPLIER ----------
    const activityMap = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        very_active: 1.9,
    };

    const multiplier = activityMap[activityLevel] || 1.2;

    // ---------- TDEE ----------
    const tdee = Math.round(bmr * multiplier);

    // ---------- GOAL CALORIES ----------
    let targetCalories = tdee;

    if (goalType === "fat_loss") targetCalories -= 400;
    if (goalType === "muscle_gain") targetCalories += 300;

    // ---------- MACROS ----------
    const protein = Math.round(weight * 2); // g
    const fats = Math.round(weight * 0.8);  // g

    const proteinCalories = protein * 4;
    const fatCalories = fats * 9;

    const remainingCalories =
        targetCalories - (proteinCalories + fatCalories);

    const carbs = Math.max(Math.round(remainingCalories / 4), 0);

    return {
        bmr: Math.round(bmr),
        tdee,
        calories: targetCalories,
        protein,
        carbs,
        fats,
    };
};
