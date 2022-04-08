import { DatePicker, Form, Input, Switch, TreeSelect } from 'antd';

const FormBuilder = (data: BasicListApi.Field[] | undefined) => {

  return (data || []).map((field) => {
    switch (field.type) {
      case 'text':
        return (
          <Form.Item label={field.title} name={field.key} key={field.key}>
            <Input disabled={field.disabled}></Input>
          </Form.Item>
        );
      case 'switch':
        return (
          <Form.Item label={field.title} name={field.key} key={field.key} valuePropName='checked'>
            <Switch  disabled={field.disabled}/>
          </Form.Item>
        );
      case 'datetime':
        return (
          <Form.Item label={field.title} name={field.key} key={field.key}>
            <DatePicker disabled={field.disabled}/>
          </Form.Item>
        );
      case 'tree':
        return (
          <Form.Item label={field.title} name={field.key} key={field.key}>
            <TreeSelect
              style={{ width: '100%' }}
              treeCheckable
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeData={field.data}
              placeholder="Please select"
              treeDefaultExpandAll
              disabled={field.disabled}
            />
          </Form.Item>
        );
      default:
        break;
    }
  });
};

export default FormBuilder;
