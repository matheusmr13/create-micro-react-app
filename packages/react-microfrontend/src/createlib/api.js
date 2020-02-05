import MetaProperty from './property';
import MetaFunction from './function';

import Meta from './meta';

import Shared from './shared';

class Api {
  static API_ACCESS = {
    INTERNAL: 'INTERNAL',
    PUBLIC_API: 'PUBLIC_API',
    PRIVATE_API: 'PRIVATE_API'
  }

  static TYPE = {
    PROPERTY: 'PROPERTY',
    TRIGGER: 'TRIGGER',
    FUNCTION: 'FUNCTION'
  }

  static Clazzes = {
    [Api.TYPE.FUNCTION]: MetaFunction,
    [Api.TYPE.PROPERTY]: MetaProperty
  }

  constructor(schema, meta) {
    this.shared = new Shared(name);
    this.packageName = meta.packageName;
    this.properties = Object.keys(schema.interface)
      .map(propertyName => Meta.create(
        Api.Clazzes[schema.interface[propertyName].type || Api.TYPE.PROPERTY],
        { ...schema.interface[propertyName], name: propertyName },
        this.shared.withScope(propertyName)
      ));
  }

  build(apiAccess) {
    if (!apiAccess) throw new Error('Api access required!');

    return this.properties
      .reduce((agg, property) => Object.assign(agg, property.build(apiAccess)), {});
  }
}

export default Api;
