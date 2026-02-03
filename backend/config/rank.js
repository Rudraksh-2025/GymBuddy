// config/ranks.js
export const RANKS = [
    { name: "Beginner", min: 0 },
    { name: "Pookie", min: 500 },
    { name: "Warrior", min: 1500 },
    { name: "Beast", min: 3000 },
    { name: "Elite", min: 5000 },
];

export const getRankByXP = (xp) => {
    return [...RANKS].reverse().find(r => xp >= r.min)?.name || "Beginner";
};
