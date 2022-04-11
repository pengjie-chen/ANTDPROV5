### Start project

```bash
yarn start
```

## More

此代码仅实现了 admin list [体验地址](http://public-api-v2.aspirantzhang.com/admin/user/login). 用户名：admin0 密码：admin0

```bash
pages
├── BasicList       //管理员列表
│   ├── builder     //按钮构造器、table列构造器、用户from表单构造器
│   │   ├── ActionBuilder.tsx
│   │   ├── ColumnBuilder.tsx
│   │   └── FormBuilder.tsx
│   ├── components    //modal弹窗、单页编辑
│   │   ├── Modal.tsx
│   │   └── Page.tsx
│   ├── d.json      //接口数据
│   ├── data.d.ts   //类型定义
│   ├── helper.tsx  //处理数据格式
│   ├── index.less  
│   └── index.tsx

```

组件化开发: 封装公共组件及功能性函数, 便于重复使用和修改
