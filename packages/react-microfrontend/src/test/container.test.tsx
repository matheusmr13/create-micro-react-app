import React from 'react';
import { mount } from 'enzyme';

import { ImportMicrofrontend as Container, ExportMicrofrontend } from '../index';

import App from './mock/webapp';
import myMicro from './mock/microfrontend';

describe('container', () => {
  describe('full', () => {
    const MICROFRONTEND_HOST = 'http://localhost:3001';

    let postMessageCallback : any = () => {};
    window.addEventListener = jest.fn((event, callback) => {
      if (event === 'message') postMessageCallback = callback;
    });

    window.fetch = jest.fn(() => Promise.resolve(new Response(JSON.stringify({
        "my-micro": {
          host: MICROFRONTEND_HOST
        },
      })))
    );

    const wrapper = mount((
      <Container>
        <App />
      </Container>
    ));

    it('should mount container with necessary iframes', async () => {
      expect(wrapper.html()).toEqual('');
      await new Promise((resolve) => setTimeout(resolve, 1));
      wrapper.update();
      const iframe = wrapper.find('iframe');
      expect(iframe.prop('src')).toEqual(MICROFRONTEND_HOST);
    });

    it('should load js scripts based on post message', async () => {
      postMessageCallback({
        data: {
          type: 'LOAD',
          origin: 'my-micro',
          source: 'react-microfrontend'
        }
      });
      postMessageCallback({
        data: {
          type: 'SCRIPT',
          origin: 'my-micro',
          source: 'react-microfrontend',
          payload: ['my-js-file.js']
        },
      });

      wrapper.update();

      expect(helmet.js[0]).toMatchObject({
        src: 'my-js-file.js',
        type: 'text/javascript'
      });
    });
    it('should listen to hot reload', async () => {
      window.location.reload = jest.fn();
      postMessageCallback({
        data: {
          type: 'LOAD',
          origin: 'my-micro',
          source: 'react-microfrontend'
        }
      });

      expect(window.location.reload).toHaveBeenCalled();
    });
    it('should load style and update it', async () => {
      window.location.reload = jest.fn();
      postMessageCallback({
        data: {
          type: 'STYLE',
          origin: 'my-micro',
          source: 'react-microfrontend',
          payload: ['my-style']
        }
      });

      expect(helmet.js[0]).toMatchObject({
        src: 'my-js-file.js',
        type: 'text/javascript'
      });
      expect(helmet.inlineCss[0]).toMatchObject({
        children: 'my-style',
        type: 'text/css'
      });
    });
    it('should register microfrontend', async () => {
      ExportMicrofrontend(myMicro);
      await new Promise((resolve) => setTimeout(resolve, 1));
      wrapper.update();
      expect(wrapper.find('.container-app').text()).toEqual('content')
      expect(wrapper.find('.microfrontend').text()).toEqual('micro-content');
    });
  });
});
