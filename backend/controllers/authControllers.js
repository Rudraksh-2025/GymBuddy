import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid';
// const { v4: uuidv4 } = require('uuid');
import User from '../models/User.js'
import { signAccessToken, signRefreshToken, signEmailToken, verifyRefreshToken, verifyEmailToken } from '../utils/jwt.js';
import { sendVerificationEmail } from '../utils/mailer.js';

const SALT_ROUNDS = 12;
const REFRESH_EXPIRES_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: 'Email already in use' });

        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
        const user = new User({ name, email, passwordHash });
        await user.save();

        // create email token and send verification
        const emailToken = signEmailToken({ sub: user._id, email: user.email });
        try {
            await sendVerificationEmail(user.email, emailToken);
        } catch (e) {
            console.error('Email send failed', e);
            // don't fail registration for email send issues — but inform client
        }

        res.status(201).json({ message: 'User created. Verification email sent. Please check your inbox.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;
        if (!token) return res.status(400).send('Missing token');

        const payload = verifyEmailToken(token);
        const userId = payload.sub;
        const user = await User.findById(userId);
        if (!user) return res.status(400).send('Invalid token');

        user.isVerified = true;
        await user.save();

        // redirect to frontend success page, or send json
        return res.redirect(`${process.env.FRONTEND_URL}/verify-success`);
    } catch (err) {
        console.error(err);
        return res.status(400).send('Invalid or expired token');
    }
};

export const login = async (req, res) => {
    try {
        const { email, password, userAgent } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

        if (!user.isVerified) {
            return res.status(403).json({ message: 'Please verify your email before logging in' });
        }

        const accessToken = signAccessToken({ sub: user._id, email: user.email });
        const refreshToken = signRefreshToken({ sub: user._id, jti: uuidv4() });

        // store refresh token in DB with expiry
        const expiresAt = new Date(Date.now() + REFRESH_EXPIRES_MS);
        user.refreshTokens.push({ token: refreshToken, expiresAt, userAgent: userAgent || req.get('User-Agent') });
        await user.save();

        // send refresh token as HTTP-only cookie (recommended) + return access token in body
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: REFRESH_EXPIRES_MS
        });

        return res.json({ accessToken, user: { id: user._id, email: user.email, name: user.name } });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
};

export const refreshToken = async (req, res) => {
    try {
        // try cookie first
        const token = req.cookies.refreshToken || req.body.refreshToken || req.headers['x-refresh-token'];
        if (!token) return res.status(401).json({ message: 'Missing refresh token' });

        const payload = verifyRefreshToken(token);
        const userId = payload.sub;

        const user = await User.findById(userId);
        if (!user) return res.status(401).json({ message: 'Invalid refresh token' });

        const stored = user.refreshTokens.find(rt => rt.token === token);
        if (!stored) return res.status(401).json({ message: 'Refresh token revoked' });
        if (stored.expiresAt && stored.expiresAt < new Date()) {
            // remove expired token
            user.refreshTokens = user.refreshTokens.filter(rt => rt.token !== token);
            await user.save();
            return res.status(401).json({ message: 'Refresh token expired' });
        }

        // rotate: remove old token, create new one
        user.refreshTokens = user.refreshTokens.filter(rt => rt.token !== token);
        const newRefreshToken = signRefreshToken({ sub: user._id, jti: uuidv4() });
        const expiresAt = new Date(Date.now() + REFRESH_EXPIRES_MS);
        user.refreshTokens.push({ token: newRefreshToken, expiresAt, userAgent: req.get('User-Agent') });
        await user.save();

        const accessToken = signAccessToken({ sub: user._id, email: user.email });

        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: REFRESH_EXPIRES_MS
        });

        return res.json({ accessToken });
    } catch (err) {
        console.error(err);
        return res.status(401).json({ message: 'Invalid refresh token' });
    }
};

export const logout = async (req, res) => {
    try {
        const token = req.cookies.refreshToken || req.body.refreshToken || req.headers['x-refresh-token'];
        if (token) {
            // remove token from user
            const payload = (() => {
                try { return verifyRefreshToken(token); } catch (e) { return null; }
            })();
            if (payload && payload.sub) {
                const user = await User.findById(payload.sub);
                if (user) {
                    user.refreshTokens = user.refreshTokens.filter(rt => rt.token !== token);
                    await user.save();
                }
            }
        }
        // clear cookie
        res.clearCookie('refreshToken', { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        return res.json({ message: 'Logged out' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
};
