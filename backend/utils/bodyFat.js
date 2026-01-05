export const calculateBodyFat = ({
  gender = "male",
  waist, // inches
  neck,  // inches
  height // cm
}) => {
  if (!waist || !neck || !height) return null;

  // Convert ONLY height to inches
  const h = height / 2.54;

  let bodyFat;

  if (gender === "male") {
    bodyFat =
      86.010 * Math.log10(waist - neck) -
      70.041 * Math.log10(h) +
      36.76;
  } else {
    bodyFat =
      163.205 * Math.log10(waist + neck) -
      97.684 * Math.log10(h) -
      78.387;
  }

  return Number(bodyFat.toFixed(2));
};
