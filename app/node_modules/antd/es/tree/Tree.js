function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import * as React from 'react';
import RcTree, { TreeNode } from 'rc-tree';
import classNames from 'classnames';
import DirectoryTree from './DirectoryTree';
import { ConfigContext } from '../config-provider';
import collapseMotion from '../_util/motion';
import renderSwitcherIcon from './utils/iconUtil';
var Tree = React.forwardRef(function (props, ref) {
  var _classNames;

  var _React$useContext = React.useContext(ConfigContext),
      getPrefixCls = _React$useContext.getPrefixCls,
      direction = _React$useContext.direction;

  var customizePrefixCls = props.prefixCls,
      className = props.className,
      showIcon = props.showIcon,
      showLine = props.showLine,
      _switcherIcon = props.switcherIcon,
      blockNode = props.blockNode,
      children = props.children,
      checkable = props.checkable;
  var prefixCls = getPrefixCls('tree', customizePrefixCls);
  return /*#__PURE__*/React.createElement(RcTree, _extends({
    itemHeight: 20,
    ref: ref
  }, props, {
    prefixCls: prefixCls,
    className: classNames(className, (_classNames = {}, _defineProperty(_classNames, "".concat(prefixCls, "-icon-hide"), !showIcon), _defineProperty(_classNames, "".concat(prefixCls, "-block-node"), blockNode), _defineProperty(_classNames, "".concat(prefixCls, "-rtl"), direction === 'rtl'), _classNames)),
    checkable: checkable ? /*#__PURE__*/React.createElement("span", {
      className: "".concat(prefixCls, "-checkbox-inner")
    }) : checkable,
    switcherIcon: function switcherIcon(nodeProps) {
      return renderSwitcherIcon(prefixCls, _switcherIcon, showLine, nodeProps);
    }
  }), children);
});
Tree.TreeNode = TreeNode;
Tree.DirectoryTree = DirectoryTree;
Tree.defaultProps = {
  checkable: false,
  showIcon: false,
  motion: _extends(_extends({}, collapseMotion), {
    motionAppear: false
  }),
  blockNode: false
};
export default Tree;