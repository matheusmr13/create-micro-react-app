import Api from '../api';

const buildApi = customInterface => new Api({ interface: customInterface }, {
  packageName: 'test'
}).build(Api.API_ACCESS.PUBLIC_API);
const VALUE_1 = { prop: 'value1' };
const VALUE_2 = { prop: 'value2' };

describe('Create Lib', () => {
  describe('property', () => {
    const mylib = buildApi({
      myProp: {}
    });

    it('should create lib with simple methods', () => {
      expect(mylib).toHaveProperty('getMyProp');
      expect(mylib).toHaveProperty('setMyProp');
      expect(mylib).toHaveProperty('onMyPropChange');
    });
    it('should get and set property', () => {
      const value = {};
      mylib.setMyProp(value);
      expect(mylib.getMyProp()).toEqual(value);
    });
    it('should listen to property changes', () => {
      const onMyPropChange = jest.fn();
      mylib.onMyPropChange(onMyPropChange);

      mylib.setMyProp(VALUE_1);
      mylib.setMyProp(VALUE_2);

      expect(onMyPropChange).toHaveBeenCalledTimes(2);
      expect(onMyPropChange).toHaveBeenCalledWith(VALUE_1);
      expect(onMyPropChange).toHaveBeenCalledWith(VALUE_2);
    });
  });
  describe('function', () => {
    const mylib = buildApi({
      myFunction: {
        type: Api.TYPE.FUNCTION
      }
    });
    it('should create lib with simple methods', () => {
      expect(mylib).toHaveProperty('callMyFunction');
      expect(mylib).toHaveProperty('onMyFunctionCalled');
    });
    it('should execute function', () => {
      const mockFunc = jest.fn();
      mylib.onMyFunctionCalled(mockFunc);

      mylib.callMyFunction(null, null);
      mylib.callMyFunction(VALUE_1, VALUE_2);

      expect(mockFunc).toHaveBeenCalledTimes(2);
      expect(mockFunc).toHaveBeenCalledWith(null, null);
      expect(mockFunc).toHaveBeenCalledWith(VALUE_1, VALUE_2);
    });
  });
  describe('trigger', () => {
    const mylib = buildApi({
      myTopic: {
        type: Api.TYPE.TRIGGER
      }
    });
    it('should create lib with simple methods', () => {
      expect(mylib).toHaveProperty('subscribeToMyTopic');
      expect(mylib).toHaveProperty('publishOnMyTopic');
    });
    it('should execute function', () => {
      const firstSubscription = jest.fn();
      mylib.subscribeToMyTopic(firstSubscription);

      const secondSubscription = jest.fn();
      mylib.subscribeToMyTopic(secondSubscription);

      mylib.callMyFunction(null, null);
      mylib.callMyFunction(VALUE_1, VALUE_2);

      expect(firstSubscription).toHaveBeenCalledTimes(2);
      expect(firstSubscription).toHaveBeenCalledWith(null, null);
      expect(firstSubscription).toHaveBeenCalledWith(VALUE_1, VALUE_2);

      expect(secondSubscription).toHaveBeenCalledTimes(2);
      expect(secondSubscription).toHaveBeenCalledWith(null, null);
      expect(secondSubscription).toHaveBeenCalledWith(VALUE_1, VALUE_2);
    });
  });
});
