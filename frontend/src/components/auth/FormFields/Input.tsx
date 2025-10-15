import React from 'react';

interface InputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}

const Input: React.FC<InputProps> = ({ label, value, onChange, placeholder, type = 'text' }) => {
  return (
    <div className="form-field">
      <label>
        {label}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      </label>
    </div>
  );
};

export default Input;