import firebase from 'modules/account/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

const useLoggedUser = () => {
  const [user] = useAuthState(firebase.auth());
  if (!user) throw new Error('Cannot use this hook without being logged in');
  return user;
};

export default useLoggedUser;
