import React from 'react';

const PreviewPanel = ({ formData }) => {
    return (
        <div className="preview-panel">
            <h2>Form Preview</h2>
            <form>
                {formData.map((field, index) => {
                    switch (field.type) {
                        case 'input':
                            return (
                                <div key={index}>
                                    <label>{field.label}</label>
                                    <input type="text" name={field.name} />
                                </div>
                            );
                        case 'select':
                            return (
                                <div key={index}>
                                    <label>{field.label}</label>
                                    <select name={field.name}>
                                        {field.options.map((option, idx) => (
                                            <option key={idx} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            );
                        case 'checkbox':
                            return (
                                <div key={index}>
                                    <label>
                                        <input type="checkbox" name={field.name} />
                                        {field.label}
                                    </label>
                                </div>
                            );
                        case 'radio':
                            return (
                                <div key={index}>
                                    <label>{field.label}</label>
                                    {field.options.map((option, idx) => (
                                        <div key={idx}>
                                            <label>
                                                <input type="radio" name={field.name} value={option.value} />
                                                {option.label}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            );
                        default:
                            return null;
                    }
                })}
            </form>
        </div>
    );
};

export default PreviewPanel;