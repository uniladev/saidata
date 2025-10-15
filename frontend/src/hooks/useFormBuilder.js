import { useState } from 'react';
import { FormSchema } from '../schemas/formSchema';
import { FieldTypes } from '../schemas/fieldTypes';

const useFormBuilder = () => {
    const [formSchema, setFormSchema] = useState<FormSchema>({
        fields: [],
    });

    const addField = (fieldType: FieldTypes) => {
        setFormSchema((prevSchema) => ({
            ...prevSchema,
            fields: [...prevSchema.fields, { type: fieldType, properties: {} }],
        }));
    };

    const removeField = (index: number) => {
        setFormSchema((prevSchema) => ({
            ...prevSchema,
            fields: prevSchema.fields.filter((_, i) => i !== index),
        }));
    };

    const updateField = (index: number, properties: object) => {
        setFormSchema((prevSchema) => {
            const updatedFields = [...prevSchema.fields];
            updatedFields[index] = { ...updatedFields[index], properties };
            return { ...prevSchema, fields: updatedFields };
        });
    };

    return {
        formSchema,
        addField,
        removeField,
        updateField,
    };
};

export default useFormBuilder;