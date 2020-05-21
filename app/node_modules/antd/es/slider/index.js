function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

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
import RcSlider from "rc-slider/es/Slider";
import RcRange from "rc-slider/es/Range";
import RcHandle from "rc-slider/es/Handle";
import classNames from 'classnames';
import SliderTooltip from './SliderTooltip';
import { ConfigContext } from '../config-provider';
var Slider = React.forwardRef(function (props, ref) {
  var _React$useContext = React.useContext(ConfigContext),
      getPrefixCls = _React$useContext.getPrefixCls,
      direction = _React$useContext.direction,
      getPopupContainer = _React$useContext.getPopupContainer;

  var _React$useState = React.useState({}),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      visibles = _React$useState2[0],
      setVisibles = _React$useState2[1];

  var toggleTooltipVisible = function toggleTooltipVisible(index, visible) {
    var temp = _extends({}, visibles);

    temp[index] = visible;
    setVisibles(temp);
  };

  var handleWithTooltip = function handleWithTooltip(_a) {
    var tooltipPrefixCls = _a.tooltipPrefixCls,
        prefixCls = _a.prefixCls,
        _b = _a.info,
        value = _b.value,
        dragging = _b.dragging,
        index = _b.index,
        restProps = __rest(_b, ["value", "dragging", "index"]);

    var tipFormatter = props.tipFormatter,
        tooltipVisible = props.tooltipVisible,
        tooltipPlacement = props.tooltipPlacement,
        getTooltipPopupContainer = props.getTooltipPopupContainer,
        vertical = props.vertical;
    var isTipFormatter = tipFormatter ? visibles[index] || dragging : false;
    var visible = tooltipVisible || tooltipVisible === undefined && isTipFormatter;
    return /*#__PURE__*/React.createElement(SliderTooltip, {
      prefixCls: tooltipPrefixCls,
      title: tipFormatter ? tipFormatter(value) : '',
      visible: visible,
      placement: tooltipPlacement || (vertical ? 'right' : 'top'),
      transitionName: "zoom-down",
      key: index,
      overlayClassName: "".concat(prefixCls, "-tooltip"),
      getPopupContainer: getTooltipPopupContainer || getPopupContainer || function () {
        return document.body;
      }
    }, /*#__PURE__*/React.createElement(RcHandle, _extends({}, restProps, {
      value: value,
      onMouseEnter: function onMouseEnter() {
        return toggleTooltipVisible(index, true);
      },
      onMouseLeave: function onMouseLeave() {
        return toggleTooltipVisible(index, false);
      }
    })));
  };

  var customizePrefixCls = props.prefixCls,
      customizeTooltipPrefixCls = props.tooltipPrefixCls,
      range = props.range,
      className = props.className,
      restProps = __rest(props, ["prefixCls", "tooltipPrefixCls", "range", "className"]);

  var prefixCls = getPrefixCls('slider', customizePrefixCls);
  var tooltipPrefixCls = getPrefixCls('tooltip', customizeTooltipPrefixCls);
  var cls = classNames(className, _defineProperty({}, "".concat(prefixCls, "-rtl"), direction === 'rtl')); // make reverse default on rtl direction

  if (direction === 'rtl' && !restProps.vertical) {
    restProps.reverse = !restProps.reverse;
  }

  if (range) {
    return /*#__PURE__*/React.createElement(RcRange, _extends({}, restProps, {
      className: cls,
      ref: ref,
      handle: function handle(info) {
        return handleWithTooltip({
          tooltipPrefixCls: tooltipPrefixCls,
          prefixCls: prefixCls,
          info: info
        });
      },
      prefixCls: prefixCls,
      tooltipPrefixCls: tooltipPrefixCls
    }));
  }

  return /*#__PURE__*/React.createElement(RcSlider, _extends({}, restProps, {
    className: cls,
    ref: ref,
    handle: function handle(info) {
      return handleWithTooltip({
        tooltipPrefixCls: tooltipPrefixCls,
        prefixCls: prefixCls,
        info: info
      });
    },
    prefixCls: prefixCls,
    tooltipPrefixCls: tooltipPrefixCls
  }));
});
Slider.displayName = 'Slider';
Slider.defaultProps = {
  tipFormatter: function tipFormatter(value) {
    return typeof value === 'number' ? value.toString() : '';
  }
};
export default Slider;