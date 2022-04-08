import { useRequest } from '@/.umi/plugin-request/request';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { FooterToolbar, PageContainer } from '@ant-design/pro-layout';

import { Modal as AntdModal, Card, Col, Pagination, Row, Space, Table, Tag, message } from 'antd';
import { useEffect, useState } from 'react';
import { useSessionStorageState } from 'ahooks';
import { history } from 'umi';
import ActionBuilder from './builder/ActionBuilder';
import ColumnBuilder from './builder/ColumnBuilder';
import Modal from './components/Modal';
import { submitFieldsAdaptor } from './helper';

import styles from './index.less';

const Index = () => {
  const [sortQuery, setSortQuery] = useState('');
  const [pageQuery, setPageQuery] = useState('')
  const [modalVisible, setModalVisible] = useState(false);
  const [modalUri, setModalUri] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  //解决使用usestate，tableColumns在batchOverview在拿不到的情况，或者在batchOverview里重新拿一次tablecolumns
  const [tableColumns, setTableColumns] = useSessionStorageState<BasicListApi.Field[]>(
    'basicListTableColumns',
    [],
  );

  const { confirm } = AntdModal;

  const init = useRequest<{ data: BasicListApi.DataSource }>(
    `/api/admins?X-API-KEY=antd${pageQuery}${sortQuery}`,
    {
      manual: true,
    },
  );

  const request = useRequest(
    (values) => {
      message.loading({ content: 'Processing...', key: 'process', duration: 3 });
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
      },
      formatResult: (res: any) => {
        return res;
      },
    },
  );

  useEffect(() => {
    init.run();
  }, [pageQuery,sortQuery]);

  useEffect(() => {
    if (init?.data?.layout?.tableColumn) {
      setTableColumns(ColumnBuilder(init.data.layout.tableColumn, actionHandler));
    }
  }, [init?.data?.layout?.tableColumn]);

  const handlePaginationChange = (page: any, per_page: any) => {
    setPageQuery(`&page=${page}&per_page=${per_page}`)

  };

  const batchOverview = (dataSource: BasicListApi.Field[]) => {
    console.log(typeof dataSource);
    console.log(tableColumns);
    return (
      <Table
        size="small"
        rowKey="id"
        //曾经也曾传错值
        dataSource={dataSource}
        columns={tableColumns ? [tableColumns[0] || {}, tableColumns[1] || {}] : []}
        pagination={false}
      ></Table>
    );
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (_selectedRowKeys: any, _selectedRows: any) => {
      console.log(_selectedRows, _selectedRowKeys);
      setSelectedRowKeys(_selectedRowKeys), setSelectedRows(_selectedRows);
    },
  };

  const actionHandler = (action: BasicListApi.Action, record: BasicListApi.Field) => {
    switch (action.action) {
      case 'modal':
        setModalUri(
          action?.uri?.replace(/:\w+/g, (field) => {
            return record[field.replace(':', '')];
          }) as string,
        );
        setModalVisible(true);
        break;
      case 'page':
        const uri = action.uri?.replace(/:\w+/g, (field) => {
          return record[field.replace(':', '')];
        });
        history.push(`/basic-list${uri}`);
        break;
      case 'reload':
        init.run();
        break;
      case 'delete':
      case 'deletePermanently':
      case 'restore':
        confirm({
          title: 'Do you Want to delete user?',
          icon: <ExclamationCircleOutlined />,
          content: batchOverview(Object.keys(record || []).length ? [record] : selectedRows),
          onOk() {
            return request.run({
              uri: action.uri,
              method: action.method,
              type: action.action,
              ids: Object.keys(record||[]).length>0? [record.id] : selectedRowKeys,
            });
          },
          onCancel() {
            console.log('Cancel');
          },
        });
        break;
      default:
        break;
    }
  };


  const beforeTableLayout = () => {
    return (
      <Row>
        <Col xs={24} sm={12}>
          ...
        </Col>
        <Col xs={24} sm={12} className={styles.tableToolbar}>
          <Space>{ActionBuilder(init?.data?.layout?.tableToolBar, actionHandler, false, {})}</Space>
        </Col>
      </Row>
    );
  };

  const afterTableLayout = () => {
    return (
      <Row>
        <Col xs={24} sm={12}>
          ..
        </Col>
        <Col xs={24} sm={12} className={styles.tableToolbar}>
          <Pagination
            className={styles.tableToolbar}
            total={init.data?.meta.total}
            showSizeChanger
            showQuickJumper
            onChange={handlePaginationChange}
            onShowSizeChange={handlePaginationChange}
            showTotal={(total) => `Total ${total} items`}
          ></Pagination>
        </Col>
      </Row>
    );
  };

  const searchLayout = () => {
    return <div>seach</div>;
  };

  const batchToolBar = () => {
    return (
      selectedRows.length > 0 && (
        <Space>{ActionBuilder(init.data.layout.batchToolBar, actionHandler)}</Space>
      )
    );
  };

  return (
    <PageContainer>
      <Card>
        {beforeTableLayout()}
        <Table
          columns={tableColumns}
          dataSource={init?.data?.dataSource}
          pagination={false}
          loading={init.loading}
          rowSelection={rowSelection}
          rowKey="id"
        ></Table>
        <FooterToolbar extra={batchToolBar()}></FooterToolbar>
        {afterTableLayout()}
      </Card>
      <Modal
        modalVisible={modalVisible}
        hideModal={() => {
          setModalVisible(false);
          init.run();
        }}
        modalUri={modalUri}
      />
    </PageContainer>
  );
};

export default Index;
