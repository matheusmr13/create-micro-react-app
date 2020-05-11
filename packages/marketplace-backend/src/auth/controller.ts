import { Request, Response } from 'express';
import User from 'user/user';
import { getGithubAccessToken, getGithubUserInfo } from './client';

class AuthController {
  public auth = async (req: Request, res: Response) => {
    const { code } = req.query;
    const githubAuth = await getGithubAccessToken(code.toString());
    const userInfos = await getGithubUserInfo(githubAuth);

    let [user] = await User.query().filter('login', '=', userInfos.login).runOnce();

    if (!user) {
      user = await User.createUser({
        name: userInfos.name,
        login: userInfos.login,
        email: userInfos.email,
      });
    }

    res.json({
      ...user.toJSON(),
      github: githubAuth,
      api: user.getJWT(),
    });
  };
}

export default new AuthController();
