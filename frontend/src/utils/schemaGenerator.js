import { FieldType } from '../schemas/fieldTypes';
// import { FormSchema } from '../types/form'; // Remove type-only import

export const generateSchema = (fields) => {
    const schema = {
        fields: fields.map(field => ({
            type: field.type,
            label: field.label,
            name: field.name,
            required: field.required || false,
        })),
    };

    return schema;
};

export const addFieldToSchema = (schema, field) => {
    schema.fields.push({
        type: field.type,
        label: field.label,
        name: field.name,
        required: field.required || false,
    });

    return schema;
};