export const calcBMR = ({ gender, weight, height, age }) => {
  // Mifflin-St Jeor
  if (gender === "male") {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
};

export const activityMultiplier = (level) => {
  switch (level) {
    case "sedentary": return 1.2;
    case "light": return 1.375;
    case "moderate": return 1.55;
    case "active": return 1.725;
    case "very_active": return 1.9;
    default: return 1.2;
  }
};

export const calcTDEE = (bmr, activityLevel) => {
  return bmr * activityMultiplier(activityLevel);
};

export const applyGoalType = (tdee, goalType) => {
  if (goalType === "fat_loss") return tdee - 400;
  if (goalType === "muscle_gain") return tdee + 300;
  return tdee; // maintain
};

export const calcMacrosFromCaloriesPct = (cal, pct) => {
  return {
    protein: Math.round((cal * pct.protein / 100) / 4),
    carbs: Math.round((cal * pct.carbs / 100) / 4),
    fats: Math.round((cal * pct.fats / 100) / 9),
  };
};
