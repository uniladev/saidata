import { useState, useEffect } from 'react';
import { FormSchema } from '../types/form';
import { generateDefaultSchema } from '../utils/schemaGenerator';

const useFormSchema = () => {
    const [formSchema, setFormSchema] = useState<FormSchema>(generateDefaultSchema());

    useEffect(() => {
        // Logic to fetch or initialize the form schema can be added here
    }, []);

    const updateSchema = (newSchema: FormSchema) => {
        setFormSchema(newSchema);
    };

    return {
        formSchema,
        updateSchema,
    };
};

export default useFormSchema;