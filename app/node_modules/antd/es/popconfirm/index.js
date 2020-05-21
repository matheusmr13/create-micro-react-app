var _this = this;

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
import ExclamationCircleFilled from '@ant-design/icons/ExclamationCircleFilled';
import Tooltip from '../tooltip';
import Button from '../button';
import { convertLegacyProps } from '../button/button';
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import defaultLocale from '../locale/default';
import { ConfigContext } from '../config-provider';
import { getRenderPropValue } from '../_util/getRenderPropValue';
var Popconfirm = React.forwardRef(function (props, ref) {
  var _React$useState = React.useState(props.visible),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      visible = _React$useState2[0],
      setVisible = _React$useState2[1];

  React.useEffect(function () {
    if ('visible' in props) {
      setVisible(props.visible);
    }
  }, [props.visible]);
  React.useEffect(function () {
    if ('defaultVisible' in props) {
      setVisible(props.defaultVisible);
    }
  }, [props.defaultVisible]);

  var settingVisible = function settingVisible(value, e) {
    if (!('visible' in props)) {
      setVisible(value);
    }

    if (props.onVisibleChange) {
      props.onVisibleChange(value, e);
    }
  };

  var onConfirm = function onConfirm(e) {
    settingVisible(false, e);

    if (props.onConfirm) {
      props.onConfirm.call(_this, e);
    }
  };

  var onCancel = function onCancel(e) {
    settingVisible(false, e);

    if (props.onCancel) {
      props.onCancel.call(_this, e);
    }
  };

  var onVisibleChange = function onVisibleChange(value) {
    var disabled = props.disabled;

    if (disabled) {
      return;
    }

    settingVisible(value);
  };

  var renderOverlay = function renderOverlay(prefixCls, popconfirmLocale) {
    var okButtonProps = props.okButtonProps,
        cancelButtonProps = props.cancelButtonProps,
        title = props.title,
        cancelText = props.cancelText,
        okText = props.okText,
        okType = props.okType,
        icon = props.icon;
    return /*#__PURE__*/React.createElement("div", {
      className: "".concat(prefixCls, "-inner-content")
    }, /*#__PURE__*/React.createElement("div", {
      className: "".concat(prefixCls, "-message")
    }, icon, /*#__PURE__*/React.createElement("div", {
      className: "".concat(prefixCls, "-message-title")
    }, getRenderPropValue(title))), /*#__PURE__*/React.createElement("div", {
      className: "".concat(prefixCls, "-buttons")
    }, /*#__PURE__*/React.createElement(Button, _extends({
      onClick: onCancel,
      size: "small"
    }, cancelButtonProps), cancelText || popconfirmLocale.cancelText), /*#__PURE__*/React.createElement(Button, _extends({
      onClick: onConfirm
    }, convertLegacyProps(okType), {
      size: "small"
    }, okButtonProps), okText || popconfirmLocale.okText)));
  };

  var _React$useContext = React.useContext(ConfigContext),
      getPrefixCls = _React$useContext.getPrefixCls;

  var customizePrefixCls = props.prefixCls,
      placement = props.placement,
      restProps = __rest(props, ["prefixCls", "placement"]);

  var prefixCls = getPrefixCls('popover', customizePrefixCls);
  var overlay = /*#__PURE__*/React.createElement(LocaleReceiver, {
    componentName: "Popconfirm",
    defaultLocale: defaultLocale.Popconfirm
  }, function (popconfirmLocale) {
    return renderOverlay(prefixCls, popconfirmLocale);
  });
  return /*#__PURE__*/React.createElement(Tooltip, _extends({}, restProps, {
    prefixCls: prefixCls,
    placement: placement,
    onVisibleChange: onVisibleChange,
    visible: visible,
    overlay: overlay,
    ref: ref
  }));
});
Popconfirm.defaultProps = {
  transitionName: 'zoom-big',
  placement: 'top',
  trigger: 'click',
  okType: 'primary',
  icon: /*#__PURE__*/React.createElement(ExclamationCircleFilled, null),
  disabled: false
};
export default Popconfirm;