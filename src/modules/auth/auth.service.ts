import httpStatus from 'http-status';
import mongoose from 'mongoose';
// eslint-disable-next-line import/no-extraneous-dependencies
import firebaseAdmin, { ServiceAccount } from 'firebase-admin';
import Token from '../token/token.model';
import ApiError from '../errors/ApiError';
import tokenTypes from '../token/token.types';
import { getUserById, getUserByUsername, updateUserById } from '../user/user.service';
import { IUserDoc, IUserWithTokens } from '../user/user.interfaces';
import { generateAuthTokens, verifyToken } from '../token/token.service';

/**
 * Login with username and password
 * @param {string} username
 * @param {string} password
 * @returns {Promise<IUserDoc>}
 */
export const loginUserWithUsernameAndPassword = async (username: string, password: string): Promise<IUserDoc> => {
  const user = await getUserByUsername(username);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return user;
};

/**
 * Login with Google
 * @param {string} tokenId
 * @returns {Promise<any>}
 */
const serviceAccount = {
  type: 'service_account',
  project_id: 'chatapp-762d9',
  private_key_id: 'd380c56efda8c6628fbe71b7920baf5470e8a717',
  private_key:
    '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCgBOnIMJC9LRo7\n63JE1bLNkXmksLHiHo0r1XmW6LEOjUsuJwi8xO+cLCKb+rR4HCi07yh2g8T5ce4y\n2EQiNb40En6Js7p7lQpuHYq1ssFvmQSBYWw5unnbx6BpzFizFKLApHVJ2PR4VQv4\nRoxVfWnhg8UOw8MZy1Gg3R0Nsz+z2caaL7w1QYrXUYr5zDOaxBluiQsFnYcxCKYr\npWB3RbKZeU45vcY/rw3mbtMQwAKC7YzibE2fwKMHwG9ihjg47TSjdX3RkDxk7QX8\nP2QU4jP94j6lMz+j55EwtCL5oi6f2WTsaXvtwkPGb0bTpR6DYEZAqVKtuEyVMSPt\nyZGyqukRAgMBAAECggEABRPZgAs5doVBOzmXpZiYfOZ4MzTSSilmbkeux7j1uvoF\nCA9/8ER5UW3C7Is2Rtw8Nu839phsYO6/wbrZdkfus4E1j8SavtvjdIvJAwZgwLFS\nF9G5xkmqXvd87wp8yImXt1A98q745T4WnC/POWcPu71g3KdzJVpYH7LQc+bg4eHS\n7F4J+cu0sdVHfPWVyp/ztCcI1sBgKhwW5v3BVnK7g7jTz+2tnrQjRA+piOrc1B5N\nY69lAI5zTpnGAt9az5PsY2sKl4Df3zt3u2CtjGT8VnA4WFr2Wmk1tG1O4Dw92vvm\n91AWsDO+lbYYBbh1I458E2+rHPXq7CeifdaVU2qEeQKBgQDTz0JiKwl9F0lJMl8A\nNlx7KafwV/YAAaJExFn53wdjZCrYfdn4r6cx6ndlpvplV6+c1I+PHHHpyw9T6tZ9\nlD7fVXq6pccyWRUi0cLVc/z6GnbmVbeiPHzdsbmHVTsqdXO4uhTkpmRgVX+cxQBD\n836fObJnN+VjcFrvZ4KaQRsISQKBgQDBZ4fI1/msAs8kroO+e/RPte+6oIm2GZBY\n452IP7ZyurbdAdw8g7GWb85XAOkAcHTbRtmjblGosu2xBV68HQrz4dNt7m1eIjoZ\nGCUXLtnHlyjVeO0Lgq/V4bJQUVQfv8Hg65MkniNCvpkVRy1FNZ2XItFI7n952AH0\nrYnGyBuqiQKBgCn0Eo0JQz7gvuZdsM2E9vp6PMZxVcuYh0Cht8SzdW4taAMromIM\nwMw1SeL7mPs7zA//VlQdaT7KtsWDbWrAU1e/Qaj4ryT82h/kdnf7Gm+bkFN9RPtA\niecLjdkNe8OkMgCz8vF7N8SRCs7NgojzEPCO6BRj0O7KUWi8EvVk0erpAoGAV0Bb\ns7Irwvwpc0T/zmmhWGyd0DYoqmxyAIf/Q75qkuvFH4N9VhebgGDEV9/jPf192obm\nHKLiWBcQwHHJwVfg3xGcDtYnpPYP+842vXS3byG0nEnHtw+oP/doOG/YYdJipxPf\n9/8XrT7LVRwdQkHj7JEalapy/AcFKts3cuRIBvECgYAEqugLuQHKKw2iItTMjhkV\nhr4f2R9bDbC8t4aXLtNUyaJ60tqUukyRwqacC/pK3vu5eVeUmMQBXHAr1cqNLBJy\ndFp8wNuV51PYVvl+1ubCUFWb7s44udjM8dI94w1mIBthNIE/4ycAhFdYvBbb8Y7G\nsk+UGJzn/0om8j8CErbZMQ==\n-----END PRIVATE KEY-----\n',
  client_email: 'firebase-adminsdk-etgpg@chatapp-762d9.iam.gserviceaccount.com',
  client_id: '114028161173096867334',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url:
    'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-etgpg%40chatapp-762d9.iam.gserviceaccount.com',
  universe_domain: 'googleapis.com',
};

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount as ServiceAccount),
  databaseURL: 'https://chatapp.firebaseio.com',
});

export const loginUserWithGoogle = async (tokenId: string): Promise<any> => {
  const decodedToken = await firebaseAdmin.auth().verifyIdToken(tokenId);
  const { uid, email, name, picture: avatar, email_verified: isEmailVerified } = decodedToken;
  return { uid, email, name, avatar, isEmailVerified };
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise<void>}
 */
export const logout = async (refreshToken: string): Promise<void> => {
  const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  await refreshTokenDoc.deleteOne();
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<IUserWithTokens>}
 */
export const refreshAuth = async (refreshToken: string): Promise<IUserWithTokens> => {
  try {
    const refreshTokenDoc = await verifyToken(refreshToken, tokenTypes.REFRESH);
    const user = await getUserById(new mongoose.Types.ObjectId(refreshTokenDoc.user));
    if (!user) {
      throw new Error();
    }
    await refreshTokenDoc.deleteOne();
    const tokens = await generateAuthTokens(user);
    return { user, tokens };
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise<void>}
 */
export const resetPassword = async (resetPasswordToken: any, newPassword: string): Promise<void> => {
  try {
    const resetPasswordTokenDoc = await verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD);
    const user = await getUserById(new mongoose.Types.ObjectId(resetPasswordTokenDoc.user));
    if (!user) {
      throw new Error();
    }
    await updateUserById(user.id, { password: newPassword });
    await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise<IUserDoc | null>}
 */
export const verifyEmail = async (verifyEmailToken: any): Promise<IUserDoc | null> => {
  try {
    const verifyEmailTokenDoc = await verifyToken(verifyEmailToken, tokenTypes.VERIFY_EMAIL);
    const user = await getUserById(new mongoose.Types.ObjectId(verifyEmailTokenDoc.user));
    if (!user) {
      throw new Error();
    }
    await Token.deleteMany({ user: user.id, type: tokenTypes.VERIFY_EMAIL });
    const updatedUser = await updateUserById(user.id, { isEmailVerified: true });
    return updatedUser;
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
  }
};
