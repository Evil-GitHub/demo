import type { ProColumns } from '@ant-design/pro-components';
import { EditableProTable } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import React, { useEffect, useMemo, useState } from 'react';

export default () => {
  const { data, exceptionData, periods, updateRecord } = useModel(
    'EarningsComparison.model',
    (model) => ({
      data: model.data,
      exceptionData: model.exceptionData,
      periods: model.periods,
      updateRecord: model.updateRecord,
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
  console.log('🚗 🚗 🚗 ~ errorData ~ errorData:', errorData);

  const columns: ProColumns<any>[] = [
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

  return (
    <EditableProTable
      className="inner-table"
      headerTitle="公式描述"
      size="small"
      columns={columns}
      rowKey="key"
      controlled={true}
      value={errorData}
      recordCreatorProps={false}
      editable={{
        type: 'multiple',
        editableKeys,
        actionRender: (row, config, defaultDoms) => {
          return [defaultDoms.delete];
        },
        onValuesChange: (record) => {
          updateRecord(periods, record);
        },
        onChange: setEditableRowKeys,
      }}
    />
  );
};
