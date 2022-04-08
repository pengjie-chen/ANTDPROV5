import moment from "moment";

export  const setFieldsAdaptor = (data: BasicListApi.PageData) => {
  if (data.dataSource && data.layout.tabs) {
    const result = {};
    data.layout.tabs.forEach((tab) => {
      tab.data.forEach((field) => {
        switch (field.type) {
          case 'datetime':
            result[field.key] = moment(data.dataSource[field.key]);
            break;
          default:
            result[field.key] = data.dataSource[field.key];
            break;
        }
      });
    });
    return result;
  }
  return {};
};

export const submitFieldsAdaptor = (formValues:any) => {
  const result = formValues
  console.log(result)
  Object.keys(formValues).forEach((field) => {
    if(moment.isMoment(formValues[field])){
      result[field] = moment(formValues[field]).format()
    }
  });
  return result
}
