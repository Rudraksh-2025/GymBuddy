export const calcMacrosFromCalories = (calories, percents) => {
    const { proteinPct, carbsPct, fatsPct } = percents;
  
    const protein = Math.round((calories * proteinPct) / 100 / 4);
    const carbs = Math.round((calories * carbsPct) / 100 / 4);
    const fats = Math.round((calories * fatsPct) / 100 / 9);
  
    return { protein, carbs, fats };
  };
  