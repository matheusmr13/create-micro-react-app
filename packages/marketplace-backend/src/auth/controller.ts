import { Request, Response } from 'express';
import User from 'user/user';
import FirebaseWrapper from './firebase-wrapper';

class AuthController {
  public oauth = async (req: Request, res: Response) => {
    const { idToken } = req.body;
    const firebaseUser = await FirebaseWrapper.verifyIdToken(idToken);

    const { name, email, picture, user_id: userId } = firebaseUser;
    if (!email || !name || !userId) throw new Error();

    let [user] = await User.find(userId);

    if (!user) {
      user = await User.createUser({
        id: userId,
        name,
        login: email,
        email,
        picture,
      });
    }

    res.json({
      ...user.toJSON(),
      access_token: idToken,
    });
  };
}

export default new AuthController();
