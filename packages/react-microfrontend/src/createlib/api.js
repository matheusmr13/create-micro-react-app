import MetaProperty from './schema/property';
import MetaFunction from './schema/function';
import MetaTopic from './schema/topic';
import Meta from './schema/meta';

import Shared from './shared';

class Api {
  static API_ACCESS = {
    INTERNAL: 'INTERNAL',
    PUBLIC_API: 'PUBLIC_API',
    PRIVATE_API: 'PRIVATE_API'
  }

  static TYPE = {
    PROPERTY: 'PROPERTY',
    TOPIC: 'TOPIC',
    FUNCTION: 'FUNCTION'
  }

  static Clazzes = {
    [Api.TYPE.FUNCTION]: MetaFunction,
    [Api.TYPE.PROPERTY]: MetaProperty,
    [Api.TYPE.TOPIC]: MetaTopic,
  }

  constructor(schema, meta) {
    this.packageName = meta.packageName;
    this.shared = new Shared(this.packageName);
    this.properties = Object.keys(schema.interface)
      .map(propertyName => Meta.create(
        Api.Clazzes[schema.interface[propertyName].type || Api.TYPE.PROPERTY],
        { ...schema.interface[propertyName], name: propertyName },
        this.shared.withScope(propertyName)
      ));
  }

  getName() { return this.packageName; }
  getReducers() {
    return this.properties
      .reduce((agg, property) => Object.assign(agg, property.getReducers()), {});
  }

  build(apiAccess) {
    if (!apiAccess) throw new Error('Api access required!');

    return this.properties
      .reduce((agg, property) => Object.assign(agg, property.build(apiAccess)), {});
  }
}

export default Api;
