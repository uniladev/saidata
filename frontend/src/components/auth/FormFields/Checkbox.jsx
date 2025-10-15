import { Checkbox as AntCheckbox } from 'antd';
import { useFormField } from '../../../hooks/useFormField';

const Checkbox = ({ field }) => {
    const { value, onChange } = useFormField(field);

    return (
        <AntCheckbox checked={value} onChange={e => onChange(e.target.checked)}>
            {field.label}
        </AntCheckbox>
    );
};

export default Checkbox;