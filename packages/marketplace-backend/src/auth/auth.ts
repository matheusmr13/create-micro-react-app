import jwt from 'jsonwebtoken';
import User from 'user/user';

const SECRET = 'MY_COOL_SECRET';
class Account {
  static validateToken(token: string) {
    try {
      const [_, accessToken] = token.split(' ');
      const jwtPayload = <any>jwt.verify(accessToken, SECRET);
      return jwtPayload;
    } catch (e) {
      return null;
    }
  }

  static createToken(user: User) {
    const token = jwt.sign(
      {
        id: user.id,
      },
      SECRET,
      {
        expiresIn: 1000000,
      }
    );

    return {
      access_token: token,
      token_type: 'bearer',
    };
  }
}

export default Account;
