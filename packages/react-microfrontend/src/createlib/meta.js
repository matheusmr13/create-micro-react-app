class Meta {
  static ACCESS = {
    PUBLIC: 'PUBLIC',
    PRIVATE: 'PRIVATE'
  }

  constructor(props, shared) {
    this.name = props.name;
    this.access = props.access || Meta.ACCESS.PRIVATE;
    this.shared = shared;
  }

  getCapitalizedName() {
    return `${this.name.charAt(0).toUpperCase()}${this.name.substring(1)}`;
  }

  build() {
    throw new Error('Not implemented');
  }

  static create(Clazz, props, shared) {
    return new Clazz(props, shared);
  }
}

export default Meta;
