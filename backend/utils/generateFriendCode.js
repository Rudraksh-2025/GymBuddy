export const generateFriendCode = (name = "") => {
    const prefix = name.slice(0, 3).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${random}`; // e.g. RUD-A9F2
};
