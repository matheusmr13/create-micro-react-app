import schema from './schema';
import { Api } from '../../../index.tsx';
export default new Api(schema).build(Api.ACCESS.PRIVATE_API);
