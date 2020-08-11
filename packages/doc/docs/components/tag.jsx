import React from 'react';

const Tag = ({ children, color, dark }) => (
  <span
    style={{
      backgroundColor: color || 'grey',
      borderRadius: '4px',
      color: dark ? '#000' : '#fff',
      fontWeight: 'bold',
      padding: '4px 8px',
    }}
  >
    {children}
  </span>
);

export const TodoTag = () => (
  <Tag color="yellow" dark>
    TODO
  </Tag>
);
export const WipTag = () => <Tag color="orange">WIP</Tag>;
export const BetaTag = () => <Tag color="gray">BETA</Tag>;
export default Tag;
