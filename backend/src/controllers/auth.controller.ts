import { User } from '../models/User.js';
import { WorkerProfile } from '../models/WorkerProfile.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/jwt.utils.js';
import { sendSuccess, sendError } from '../utils/response.utils.js';

// Cookie options for HTTP-only cookies
const cookieOptions = {
  httpOnly: true,
  secure: false, // Set to false to allow cookie storage over HTTP local network IP testing
  sameSite: 'lax', // Lax supports cookie forwarding on cross-port same domain calls
  path: '/', // Ensures scope is root-level
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendError(res, 'A user with this email already exists', 400);
    }

    const selectedRole = role === 'worker' ? 'worker' : 'customer';
    const roles = [selectedRole];
    if (selectedRole === 'worker') {
      // Allow workers to act as customers initially/automatically
      roles.push('customer');
    }

    const user = new User({
      name,
      email,
      password,
      roles,
    });

    await user.save();

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('refreshToken', refreshToken, cookieOptions);

    return sendSuccess(res, 'User registered successfully', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles,
      },
      accessToken,
      redirectToSetup: selectedRole === 'worker',
    }, 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return sendError(res, 'Invalid email or password', 400);
    }

    const isMatch = await (user as any).comparePassword(password);
    if (!isMatch) {
      return sendError(res, 'Invalid email or password', 400);
    }

    if (!user.isActive) {
      return sendError(res, 'Your account has been deactivated. Please contact support.', 403);
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('refreshToken', refreshToken, cookieOptions);

    // Check if worker profile exists if user is worker
    let hasProfile = false;
    if (user.roles.includes('worker')) {
      const profile = await WorkerProfile.findOne({ userId: user._id });
      if (profile) {
        hasProfile = true;
      }
    }

    return sendSuccess(res, 'Logged in successfully', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles,
      },
      accessToken,
      hasWorkerProfile: hasProfile,
    });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return sendError(res, 'No refresh token provided', 401);
    }

    const decoded: any = verifyRefreshToken(refreshToken);
    if (!decoded) {
      res.clearCookie('refreshToken', { httpOnly: true, secure: false, sameSite: 'lax', path: '/' });
      return sendError(res, 'Invalid or expired refresh token. Please login again.', 401);
    }

    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      res.clearCookie('refreshToken', { httpOnly: true, secure: false, sameSite: 'lax', path: '/' });
      return sendError(res, 'User session not found or token mismatched. Please login again.', 401);
    }

    if (!user.isActive) {
      res.clearCookie('refreshToken', { httpOnly: true, secure: false, sameSite: 'lax', path: '/' });
      return sendError(res, 'Your account has been deactivated. Please contact support.', 403);
    }

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    user.refreshToken = newRefreshToken;
    await user.save();

    res.cookie('refreshToken', newRefreshToken, cookieOptions);

    return sendSuccess(res, 'Access token refreshed successfully', {
      accessToken: newAccessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      const decoded: any = verifyRefreshToken(refreshToken);
      if (decoded) {
        await User.findByIdAndUpdate(decoded.id, { refreshToken: null });
      }
    }

    res.clearCookie('refreshToken', { httpOnly: true, secure: false, sameSite: 'lax', path: '/' });
    return sendSuccess(res, 'Logged out successfully');
  } catch (error) {
    next(error);
  }
};
