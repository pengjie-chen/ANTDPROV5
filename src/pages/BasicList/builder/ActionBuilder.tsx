import { Button } from 'antd';
import { ButtonType } from 'antd/es/button';


const  ActionBuilder = (
  actions: BasicListApi.Action[] | undefined,
  actionHandler:  BasicListApi.ActionHandler ,
  loading:boolean,
  record:{}
) => {
  return (actions || []).map((action) => {
    if (action.component === 'button') {
      return (
        <Button
          key={action.text}
          type={action.type as ButtonType}
          loading={loading}
          onClick={() => {
            // console.log(`record${record}`)
            actionHandler(action,record)
          }}
        >
          {action.text}
        </Button>
      );
    }
    return null;
  });
};

export default ActionBuilder;
