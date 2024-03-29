import { defaultTableConfig } from '@/utils/setting';
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import {
  EditableProTable,
  ModalForm,
  ModalFormProps,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Space } from 'antd';
import { FC, useEffect, useMemo, useRef, useState } from 'react';

const columns: ProColumns<any>[] = [
  {
    title: '公式描述',
    dataIndex: 'description',
  },
  {
    title: '是否通过',
    dataIndex: 'passes',
    valueEnum: {
      true: {
        text: '通过',
      },
      false: {
        text: '不通过',
      },
    },
    render(dom, entity) {
      const { passes } = entity;
      if (passes)
        return (
          <Space style={{ color: '#87d068' }}>
            <CheckCircleFilled />
            {dom}
          </Space>
        );
      return (
        <Space style={{ color: '#f50' }}>
          <CloseCircleFilled />
          {dom}
        </Space>
      );
    },
  },
];

const editorColumns: ProColumns<any>[] = [
  {
    title: '科目',
    dataIndex: 'type',
    editable: false,
  },
  {
    title: '值',
    dataIndex: 'value1',
    valueType: 'digit',
    fieldProps: {
      bordered: false,
      width: '200',
    },
  },
];

const Exception: FC<ModalFormProps> = (props) => {
  const { data, exceptionData, periods, updateRecords } = useModel(
    'EarningsComparison.model',
    (model) => ({
      updateRecord: model.updateRecord,
      updateRecords: model.updateRecords,
      exceptionData: model.exceptionData,
      periods: model.periods,
      data: model.data,
    }),
  );

  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() =>
    data[periods].map((item) => item.key),
  );

  useEffect(() => {
    const keys = data[periods].map((item) => item.key);
    setEditableRowKeys(keys);
  }, [periods, data]);

  const errorData = useMemo(() => {
    const keys = exceptionData[0].equation.keysToVerify;
    return data[periods].filter((item) => keys.includes(item.key));
  }, [exceptionData, data, periods]);

  const editorDataRef = useRef<readonly any[]>();

  return (
    <ModalForm
      title="表内公示平衡校验"
      autoFocusFirstInput
      {...props}
      onFinish={async () => {
        // @ts-ignore
        updateRecords(periods, editorDataRef.current);
        return true;
      }}
    >
      <ProTable
        {...defaultTableConfig}
        rowKey="key"
        search={false}
        options={false}
        pagination={false}
        columns={columns}
        size="small"
        className="inner-table"
        dataSource={exceptionData}
      />
      <EditableProTable
        className="inner-table"
        headerTitle="公式描述"
        size="small"
        columns={editorColumns}
        rowKey="key"
        controlled={true}
        value={errorData}
        onChange={(value) => {
          editorDataRef.current = value;
        }}
        recordCreatorProps={false}
        editable={{
          type: 'multiple',
          editableKeys,
          actionRender: (row, config, defaultDoms) => {
            return [defaultDoms.delete];
          },
          // onValuesChange: (record) => {
          //   updateRecord(periods, record);
          // },
          onChange: setEditableRowKeys,
        }}
      />
    </ModalForm>
  );
};

export default Exception;
