import { FirebaseUser } from './firebase-wrapper';
import UserExtra from '../entity/user-extra';

class User {
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
    const extra = await UserExtra.findOne(this.id);
    if (!extra) return UserExtra.create({ id: this.id });
    return extra;
  }
}

export default User;
