import useLocalStorage from './local-storage';
import { configureLoggedUser } from './request';

const useLoggedUser = (): [any, Function, Function] => {
  const [auth, setAuth, clearLoggedUser] = useLocalStorage('auth');
  const setLoggedUser = (loggedUser: any) => {
    console.info('setting logged user');
    configureLoggedUser(loggedUser);
    setAuth(loggedUser);
  };
  return [auth, setLoggedUser, clearLoggedUser];
};

export default useLoggedUser;
