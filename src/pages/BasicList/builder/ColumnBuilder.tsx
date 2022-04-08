
import { Space, Tag } from 'antd';
import moment from 'moment';

import ActionBuilder from './ActionBuilder';


const ColumnBuilder = (tableColumn: BasicListApi.Field[],actionHandler:BasicListApi.ActionHandler) => {
  const idColumn :BasicListApi.Field[]= [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: {
        compare: (a:any, b:any) => a.id - b.id,
        multiple: 2,
      },
    },
  ];
  const newColumns: BasicListApi.Field[] = [];
  (tableColumn || []).forEach((column) => {
    if (column.hideInColumn !== true) {
      switch (column.type) {
        case 'datetime':
          column.render = (value: any) => {
            return moment(value).format('YYYY-MM-DD HH:mm:ss');
          };
          break;
        case 'switch':
          column.render = (value: any) => {
            //find=== 就能返回数据
            const option = column.data.find((column:any) => column.value === value);
            return <Tag color={value === 1 ? 'blue' : 'red'}>{option?.title}</Tag>;
          };
          break;
        case 'actions':
          column.render = (_:any,record:any) => {
            return <Space>{ActionBuilder(column.actions,actionHandler,false,record)}</Space>;
          };
          break;
        default:
          break;
      }
      newColumns.push(column);
    }
  });

  return idColumn.concat(newColumns);
};


export default ColumnBuilder
