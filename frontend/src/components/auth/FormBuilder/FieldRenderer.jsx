import React from 'react';
import Input from '../FormFields/Input';
import Select from '../FormFields/Select';
import Checkbox from '../FormFields/Checkbox';
import Radio from '../FormFields/Radio';

const FieldRenderer = (props) => {
  const { field } = props;
  switch (field.type) {
    case 'input':
      return <Input {...field.props} />;
    case 'select':
      return <Select {...field.props} />;
    case 'checkbox':
      return <Checkbox {...field.props} />;
    case 'radio':
      return <Radio {...field.props} />;
    default:
      return null;
  }
};

export default FieldRenderer;