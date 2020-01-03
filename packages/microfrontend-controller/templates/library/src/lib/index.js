import { CreateLib } from 'react-microfrontend';
import schema from './schema';

const api = CreateLib(schema, { apiAccess: CreateLib.BUILD_TYPE.PRIVATE_API, packageName: "app_mylib" });

api.onInitialize(() => {
  api.setExample([]);
  api.onAddExampleCartCalled(item => {
    const example = api.getExample();
    example.push(item);
    api.setExample(example);
  });
})

export default api;
