import { FirebaseUser } from './firebase-wrapper';
import User from '../entity/user';

class LoggedUser {
  id: string;
  name?: string;
  email?: string;
  picture?: string;

  constructor(firebaseUser: FirebaseUser) {
    if (!firebaseUser.user_id) throw new Error('Firebase user without id');

    this.id = firebaseUser.user_id;
    this.name = firebaseUser.name;
    this.email = firebaseUser.email;
    this.picture = firebaseUser.picture;
  }

  async getExtra() {
    const extra = await User.findOne(this.id);
    if (!extra) return User.create({ id: this.id });
    return extra;
  }
}

export default LoggedUser;
