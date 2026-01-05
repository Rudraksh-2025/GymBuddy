export const calculateBodyFat = ({
  gender = "male",
  waist,
  neck,
  height, // cm
}) => {
  if (!waist || !neck || !height) return null;

  // Convert cm → inches
  const w = waist / 2.54;
  const n = neck / 2.54;
  const h = height / 2.54;

  let bodyFat;

  if (gender === "male") {
    bodyFat =
      86.010 * Math.log10(w - n) -
      70.041 * Math.log10(h) +
      36.76;
  } else {
    bodyFat =
      163.205 * Math.log10(w + n) -
      97.684 * Math.log10(h) -
      78.387;
  }

  return Number(bodyFat.toFixed(2));
};
