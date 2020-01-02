
    import { CreateLib } from 'react-microfrontend';
    import schema from './schema';

    export default CreateLib(schema, {
      apiAccess: CreateLib.BUILD_TYPE.PUBLIC_API,
      packageName: "market_quick-cart"
    });
  