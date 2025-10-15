import React from 'react';
import { Radio as AntRadio } from 'antd';

const Radio = ({ options, ...props }) => {
  return (
    <AntRadio.Group {...props}>
      {options.map((option) => (
        <AntRadio key={option.value} value={option.value}>
          {option.label}
        </AntRadio>
      ))}
    </AntRadio.Group>
  );
};

export default Radio;