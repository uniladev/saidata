import { Schema } from '@formily/react';

const formSchema: Schema = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      title: 'Form Title',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    description: {
      type: 'string',
      title: 'Form Description',
      'x-decorator': 'FormItem',
      'x-component': 'Input.TextArea',
    },
    fields: {
      type: 'array',
      title: 'Form Fields',
      'x-decorator': 'FormItem',
      'x-component': 'FieldArray',
      items: {
        type: 'object',
        properties: {
          fieldType: {
            type: 'string',
            title: 'Field Type',
            enum: ['Input', 'Select', 'Checkbox', 'Radio'],
            'x-decorator': 'FormItem',
            'x-component': 'Select',
          },
          fieldLabel: {
            type: 'string',
            title: 'Field Label',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
          },
          fieldOptions: {
            type: 'array',
            title: 'Field Options',
            'x-decorator': 'FormItem',
            'x-component': 'FieldArray',
            items: {
              type: 'string',
              title: 'Option',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
          },
        },
      },
    },
  },
};

export default formSchema;