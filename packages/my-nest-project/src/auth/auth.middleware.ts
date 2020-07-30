import { Injectable, NestMiddleware } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private authService: AuthService) {}

  async use(req: any, res: any, next: () => void) {
    console.info('he', req.headers);
    const { authorization } = req.headers;
    if (!authorization) {
      res.status(401).send();
      return;
    }

    try {
      const user = await this.authService.verifyIdToken(authorization);
      this.authService.injectLoggedUser(user);
      next();
    } catch (e) {
      console.info(e);
      res.status(401).send();
      return;
    }
  }
}
