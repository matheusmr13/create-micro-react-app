import MetaProperty from './schema/property';
import MetaFunction from './schema/function';
import MetaTopic from './schema/topic';
import Meta from './schema/meta';

import Shared from './shared';

enum ACCESS {
  INTERNAL,
  PUBLIC_API,
  PRIVATE_API
};

enum TYPE {
  PROPERTY,
  TOPIC,
  FUNCTION,
}

class Api {
  static ACCESS = ACCESS;
  static TYPE = TYPE

  static Clazzes = {
    [Api.TYPE.FUNCTION]: MetaFunction,
    [Api.TYPE.PROPERTY]: MetaProperty,
    [Api.TYPE.TOPIC]: MetaTopic,
  }

  packageName: string;
  shared: Shared;
  properties ?: any;
  view: any;

  constructor(schema, meta) {
    this.packageName = schema.name || meta.packageName;
    this.shared = new Shared(this.packageName);
    this.view = schema.view;
    if (schema.interface) {
      this.properties = Object.keys(schema.interface)
        .map(propertyName => Meta.create(
          Api.Clazzes[schema.interface[propertyName].type || Api.TYPE.PROPERTY],
          { ...schema.interface[propertyName], name: propertyName },
          this.shared.withScope(propertyName)
        ));
    }
  }

  getName() { return this.packageName; }
  getReducers() {
    if (!this.properties) return {};

    return this.properties
      .reduce((agg, property) => Object.assign(agg, property.getReducers()), {});
  }

  build(apiAccess) {
    if (!apiAccess) throw new Error('Api access required!');
    if (!this.properties) return {};

    return this.properties
      .reduce((agg, property) => Object.assign(agg, property.build(apiAccess)), {});
  }
}

export default Api;
