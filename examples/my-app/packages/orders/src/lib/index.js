import { CreateLib } from 'react-microfrontend';
import schema from './schema';

const api = CreateLib(schema, { apiAccess: CreateLib.BUILD_TYPE.PRIVATE_API, packageName: "orders" });

api.onInitialize(() => {
  api.setExample([]);
  api.onAddExampleCalled(item => {
    const example = api.getExample();
    example.push(item);
    api.setExample(example);
  });
})

export default api;