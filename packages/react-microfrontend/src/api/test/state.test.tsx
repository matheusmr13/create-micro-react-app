import React from 'react';
import { mount } from 'enzyme';
import Api from '..';
import ApiProvider from '../state/provider';

const test = new Api({
  interface: {
    myProp: {}
  }
}, {
  packageName: 'test'
});


describe('State', () => {
  describe('property', () => {
    const mylib = test.build(Api.ACCESS.PUBLIC_API);

    const MyComponent = (props) => (
      <span>{props.myProp}</span>
    );

    it('should create lib with simple methods', () => {
      expect(mylib).toHaveProperty('withMyProp');
    });
    it('should connect component with prop', () => {
      const Wrapped = mylib.withMyProp(MyComponent);
      const wrapper = mount((
        <ApiProvider microfrontends={{ test }}>
          <Wrapped />
        </ApiProvider>
      ));

      mylib.setMyProp('my cool text');
      wrapper.update();
      expect(wrapper.text()).toEqual('my cool text')

      mylib.setMyProp('my another text');
      wrapper.update();
      expect(wrapper.text()).toEqual('my another text')
    });
    it('should connect and listen to changes on props', () => {
      const Wrapped = mylib.withMyProp(({ myProp }) => (
        <div>
          <button onClick={() => mylib.setMyProp(myProp + 1)}>+</button>
          <span>{myProp}</span>
        </div>
      ));
      const wrapper = mount((
        <ApiProvider microfrontends={{ test }}>
          <Wrapped />
        </ApiProvider>
      ));

      mylib.setMyProp(0);
      wrapper.update();

      expect(wrapper.find('span').text()).toEqual('0');
      expect(wrapper.find('button').simulate('click'));
      expect(wrapper.find('span').text()).toEqual('1');
      expect(wrapper.find('button').simulate('click'));
      expect(wrapper.find('span').text()).toEqual('2');
    });
  });
});
