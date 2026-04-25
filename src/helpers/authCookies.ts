import { type CookieOptions, type Request, type Response } from 'express';

const isDevelopment = process.env['NODE_ENV']?.toLowerCase() === 'development';

const cookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: isDevelopment ? 'lax' : 'strict',
  secure: isDevelopment ? false : true,
  signed: true,
};

export const getCookiesInExpress = (req: Request) => {
  const signedCookies = req.signedCookies as Partial<
    Record<'accessToken' | 'refreshToken', string>
  >;
  const accessToken = signedCookies.accessToken;
  const refreshToken = signedCookies.refreshToken;

  return { accessToken, refreshToken };
};

export const AuthCookie = {
  setAuthCookies(
    res: Response,
    accessToken: string,
    refreshToken: string
  ): void {
    res.cookie('accessToken', accessToken, {
      ...cookieOptions,
      maxAge: 900000,
    });

    res.cookie('refreshToken', refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  },

  removeAuthCookies(res: Response): void {
    res.clearCookie('accessToken', {
      ...cookieOptions,
    });

    res.clearCookie('refreshToken', {
      ...cookieOptions,
    });
  },
};
