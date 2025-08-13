import jwt from 'jsonwebtoken';


export function signAccessToken(payload) {
    return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m' });
}

export function signRefreshToken(payload) {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d' });
}

export function signEmailToken(payload) {
    return jwt.sign(payload, process.env.JWT_EMAIL_SECRET, { expiresIn: process.env.EMAIL_TOKEN_EXPIRES_IN || '1d' });
}

export function verifyAccessToken(token) {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
}
export function verifyRefreshToken(token) {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
}
export function verifyEmailToken(token) {
    return jwt.verify(token, process.env.JWT_EMAIL_SECRET);
}

