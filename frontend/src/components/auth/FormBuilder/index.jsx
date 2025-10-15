import React from 'react';
import { FormProvider } from 'react-hook-form';
import FieldRenderer from './FieldRenderer';
import PropertyPanel from './PropertyPanel';
import PreviewPanel from './PreviewPanel';

const FormBuilder = () => {
    const methods = useForm();

    return (
        <FormProvider {...methods}>
            <div className="form-builder">
                <PropertyPanel />
                <FieldRenderer />
                <PreviewPanel />
            </div>
        </FormProvider>
    );
};

export default FormBuilder;