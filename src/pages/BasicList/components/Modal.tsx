import React, { useEffect } from 'react';
import { Modal as AntModal, Button, Form, Input, message } from 'antd';
import { useRequest } from 'umi';
import FormBuilder from '../builder/FormBuilder';
import moment from 'moment';
import ActionBuilder from '../builder/ActionBuilder';
import { setFieldsAdaptor, submitFieldsAdaptor } from '../helper';

const Modal = ({
  modalVisible,
  hideModal,
  modalUri,
}: {
  modalVisible: boolean;
  hideModal: () => void;
  modalUri: string;
}) => {
  const [form] = Form.useForm();
  const init = useRequest<{ data: BasicListApi.PageData }>(
    `${modalUri}?X-API-KEY=antd`,
    {
      manual: true,
      onError: () => {
        hideModal();
      },
    },
  );

  //useRequest例子https://ahooks.js.org/zh-CN/hooks/use-request/index
  const request = useRequest(
    (values) => {
      message.loading({ content: 'Processing...', key: 'process', duration: 3});
      const { uri, method, ...formValues } = values;
      return {
        url: `https://public-api-v2.aspirantzhang.com${uri}`,
        method,
        data: {
          ...submitFieldsAdaptor(formValues),
          'X-API-KEY': 'antd',
        },
      };
    },
    {
      manual: true,
      onSuccess: (data) => {
        message.success({
          content: data.message,
          key: 'process',
        });
        hideModal();
      },
      formatResult: (res: any) => {
        return res;
      },
    },
  );

  useEffect(() => {
    if(modalVisible){
      form.resetFields();
      init.run();
    }
  }, [modalVisible]);

  useEffect(() => {
    if (init.data) {
      form.setFieldsValue(setFieldsAdaptor(init.data));
    }
  }, [init.data]);

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 14 },
  };
  const onFinish = (values:any) => {
    request.run(values);
    console.log(values);
  };

  const actionHandler = (action: BasicListApi.Action,record:any) => {
    switch (action.action) {
      case 'submit':
        form.setFieldsValue({ uri: action.uri, method: action.method });
        form.submit();
        break;
      case 'cancel':
        hideModal()
        break;
      case 'reset':
        form.resetFields()
        break;
      default:
        break;
    }
  };

  return (
    <>
      <AntModal
        maskClosable={false}
        title={'ANTmodal'}
        visible={modalVisible}

        onCancel={hideModal}
        footer={ActionBuilder(init?.data?.layout?.actions[0]?.data, actionHandler,request.loading,{})}
      >
        <Form
          form={form}
          initialValues={{ create_time: moment(), update_time: moment(), status: true }}
          {...layout}
          onFinish={onFinish}
        >
          {FormBuilder(init.data?.layout.tabs[0].data)}
          <Form.Item name="uri" key="uri" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="method" key="method" hidden>
            <Input />
          </Form.Item>
        </Form>
      </AntModal>
    </>
  );
};

export default Modal;
