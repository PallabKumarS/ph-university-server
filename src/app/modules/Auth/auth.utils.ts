import jwt, { JwtPayload } from 'jsonwebtoken';

export const createToken = (
  jwtPayload: { userId: string; role: string },
  secret: string,
  expiresIn: string,
) => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn,
  });
};

export const verifyToken = (token: string, secret: string) => {
  const newToken = token.includes('Bearer')
    ? (token.split(' ')[1] as string)
    : (token as string);
  return jwt.verify(newToken, secret) as JwtPayload;
};
