function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var __rest = this && this.__rest || function (s, e) {
  var t = {};

  for (var p in s) {
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  }

  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};

import * as React from 'react';
import RcRate from 'rc-rate';
import omit from 'omit.js';
import StarFilled from '@ant-design/icons/StarFilled';
import Tooltip from '../tooltip';
import { ConfigContext } from '../config-provider';
var Rate = React.forwardRef(function (props, ref) {
  var characterRender = function characterRender(node, _ref) {
    var index = _ref.index;
    var tooltips = props.tooltips;
    if (!tooltips) return node;
    return /*#__PURE__*/React.createElement(Tooltip, {
      title: tooltips[index]
    }, node);
  };

  var _React$useContext = React.useContext(ConfigContext),
      getPrefixCls = _React$useContext.getPrefixCls,
      direction = _React$useContext.direction;

  var prefixCls = props.prefixCls,
      restProps = __rest(props, ["prefixCls"]);

  var rateProps = omit(restProps, ['tooltips']);
  var ratePrefixCls = getPrefixCls('rate', prefixCls);
  return /*#__PURE__*/React.createElement(RcRate, _extends({
    ref: ref,
    characterRender: characterRender
  }, rateProps, {
    prefixCls: ratePrefixCls,
    direction: direction
  }));
});
Rate.displayName = 'Rate';
Rate.defaultProps = {
  character: /*#__PURE__*/React.createElement(StarFilled, null)
};
export default Rate;