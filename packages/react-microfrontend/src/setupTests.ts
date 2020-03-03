import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

const mockHelmet = (helmet) => {
  window.helmet = helmet;
}
jest.mock('react-helmet', () => ({
  Helmet: ({ children } = {}) => {
    if (children) {
      const js = (children[0] || []).map(script => script.props);
      const css = (children[1] || ([])).map(style => style.props);
      let inlineCss = [];
      if (children[2]) {
        inlineCss = children[2].reduce((agg, styles) => agg.concat(styles.map(style => style.props)), []);
      }

      mockHelmet({ js, css, inlineCss });
    }

    return null;
  }
}));
