function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

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
import classNames from 'classnames';
import LoadingOutlined from '@ant-design/icons/LoadingOutlined';
import TimelineItem from './TimelineItem';
import { ConfigContext } from '../config-provider';
import { cloneElement } from '../_util/reactNode';

var Timeline = function Timeline(props) {
  var _classNames;

  var _React$useContext = React.useContext(ConfigContext),
      getPrefixCls = _React$useContext.getPrefixCls,
      direction = _React$useContext.direction;

  var customizePrefixCls = props.prefixCls,
      _props$pending = props.pending,
      pending = _props$pending === void 0 ? null : _props$pending,
      pendingDot = props.pendingDot,
      children = props.children,
      className = props.className,
      reverse = props.reverse,
      mode = props.mode,
      restProps = __rest(props, ["prefixCls", "pending", "pendingDot", "children", "className", "reverse", "mode"]);

  var prefixCls = getPrefixCls('timeline', customizePrefixCls);
  var pendingNode = typeof pending === 'boolean' ? null : pending;
  var pendingItem = pending ? /*#__PURE__*/React.createElement(TimelineItem, {
    pending: !!pending,
    dot: pendingDot || /*#__PURE__*/React.createElement(LoadingOutlined, null)
  }, pendingNode) : null;
  var timeLineItems = reverse ? [pendingItem].concat(_toConsumableArray(React.Children.toArray(children).reverse())) : [].concat(_toConsumableArray(React.Children.toArray(children)), [pendingItem]);

  var getPositionCls = function getPositionCls(ele, idx) {
    if (mode === 'alternate') {
      if (ele.props.position === 'right') return "".concat(prefixCls, "-item-right");
      if (ele.props.position === 'left') return "".concat(prefixCls, "-item-left");
      return idx % 2 === 0 ? "".concat(prefixCls, "-item-left") : "".concat(prefixCls, "-item-right");
    }

    if (mode === 'left') return "".concat(prefixCls, "-item-left");
    if (mode === 'right') return "".concat(prefixCls, "-item-right");
    if (ele.props.position === 'right') return "".concat(prefixCls, "-item-right");
    return '';
  }; // Remove falsy items


  var truthyItems = timeLineItems.filter(function (item) {
    return !!item;
  });
  var itemsCount = React.Children.count(truthyItems);
  var lastCls = "".concat(prefixCls, "-item-last");
  var items = React.Children.map(truthyItems, function (ele, idx) {
    var pendingClass = idx === itemsCount - 2 ? lastCls : '';
    var readyClass = idx === itemsCount - 1 ? lastCls : '';
    return cloneElement(ele, {
      className: classNames([ele.props.className, !reverse && !!pending ? pendingClass : readyClass, getPositionCls(ele, idx)])
    });
  });
  var hasLabelItem = timeLineItems.some(function (item) {
    var _a;

    return !!((_a = item === null || item === void 0 ? void 0 : item.props) === null || _a === void 0 ? void 0 : _a.label);
  });
  var classString = classNames(prefixCls, (_classNames = {}, _defineProperty(_classNames, "".concat(prefixCls, "-pending"), !!pending), _defineProperty(_classNames, "".concat(prefixCls, "-reverse"), !!reverse), _defineProperty(_classNames, "".concat(prefixCls, "-").concat(mode), !!mode && !hasLabelItem), _defineProperty(_classNames, "".concat(prefixCls, "-label"), hasLabelItem), _defineProperty(_classNames, "".concat(prefixCls, "-rtl"), direction === 'rtl'), _classNames), className);
  return /*#__PURE__*/React.createElement("ul", _extends({}, restProps, {
    className: classString
  }), items);
};

Timeline.Item = TimelineItem;
Timeline.defaultProps = {
  reverse: false,
  mode: ''
};
export default Timeline;