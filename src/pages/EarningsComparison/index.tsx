import { defaultTableConfig } from '@/utils/setting';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Flex, Space, Steps } from 'antd';
import React, { useMemo, useRef, useState } from 'react';
import BalanceCheckException from './components/BalanceCheckException';
import Exception from './components/Exception';
import Result from './components/Result';
import { waitTime } from './utils';

const greenColor = '#f6ffec'; // 定义绿色
const yellowColor = '#fff566';

const compareAndSetRowStyle = (record: any, initialSourceChannel: string[] = []) => {
  if (initialSourceChannel.length < 2) return {};
  let allValuesMatch = true;

  // 创建一个集合用于存储已检查过的字段值
  const checkedFieldValues = new Set<number | string>();

  for (const field of initialSourceChannel) {
    if (!record.hasOwnProperty(field)) {
      continue; // 如果记录中不存在该字段，则跳过本次循环
    }

    // 获取字段值
    const fieldValue = record[field];

    // 如果之前已经检查过相同的值，则不需要再次比较
    if (checkedFieldValues.has(fieldValue)) {
      continue;
    }

    // 添加当前字段值到已检查过的集合中
    checkedFieldValues.add(fieldValue);

    // 检查后续字段的值是否与当前字段值相同
    for (const otherField of initialSourceChannel.slice(initialSourceChannel.indexOf(field) + 1)) {
      if (record.hasOwnProperty(otherField) && record[otherField] !== fieldValue) {
        allValuesMatch = false;
        break;
      }
    }

    if (!allValuesMatch) {
      break;
    }
  }

  // 根据比较结果设置样式
  return {
    backgroundColor: allValuesMatch ? greenColor : yellowColor,
  };
};

const extractValuesByFields = (record: any, fields: string[]): number[] => {
  return fields
    .map((field) => {
      if (record.hasOwnProperty(field)) {
        return record[field];
      } else {
        return null; // 或者返回undefined，取决于你的业务需求
      }
    })
    .filter((value) => value !== null && value !== undefined) as number[];
};

const initialSourceChannel = ['value1'];

const EarningsComparison = () => {
  const tableRef = useRef<ActionType | undefined>();
  const [activeKey, setActiveKey] = useState<React.Key>('tab1');
  const [modalVisit, setModalVisit] = useState(false);
  const [sourceChannel, setSourceChannel] = useState(initialSourceChannel);

  const { data, exceptionData, setPeriods, setExceptionType, periods } = useModel(
    'EarningsComparison.model',
    (model) => ({
      data: model.data,
      exceptionData: model.exceptionData,
      setPeriods: model.setPeriods,
      setExceptionType: model.setExceptionType,
      periods: model.periods,
    }),
  );

  const isException = useMemo(
    () => exceptionData.some((item) => !item.passes),
    [exceptionData, data, periods],
  );

  const customRender = (field: string) => (dom: React.ReactNode, record: any) => {
    if (sourceChannel.length < 2) return dom;

    const arr = extractValuesByFields(
      record,
      sourceChannel.filter((item) => item !== field),
    );
    const existsSome = arr.includes(record[field]);
    const color = existsSome ? '#5b8c00' : '#ff4d4f';

    return <span style={{ color }}>{dom}</span>;
  };

  const columns: ProColumns<any>[] = [
    {
      title: '科目',
      dataIndex: 'type',
      width: 200,
      hideInSearch: true,
    },
    {
      dataIndex: 'value1',
      title: (
        <Space>
          {isException && (
            <BalanceCheckException
              onClick={() => {
                setExceptionType('value1');
                setModalVisit(true);
              }}
            />
          )}
          同花顺
        </Space>
      ),
      width: 250,
      hideInSearch: true,
      hideInTable: !sourceChannel.includes('value1'),
      render: customRender('value1'),
    },
    {
      title: '企查查',
      dataIndex: 'value2',
      width: 250,
      hideInSearch: true,
      hideInTable: !sourceChannel.includes('value2'),
      render: customRender('value2'),
    },
    {
      title: '客户提供',
      dataIndex: 'value3',
      width: 250,
      hideInSearch: true,
      hideInTable: !sourceChannel.includes('value3'),
      render: customRender('value3'),
    },
    {
      title: '客户',
      dataIndex: 'consumer',
      hideInTable: true,
      valueEnum: {
        1: { text: '客户1', status: 'Default' },
      },
      initialValue: '1',
      fieldProps: {
        allowClear: false,
      },
    },
    {
      title: '财报期数',
      dataIndex: 'periods',
      hideInTable: true,
      initialValue: '2024-03',
      valueType: 'dateMonth',
      fieldProps: {
        allowClear: false,
      },
    },
    {
      title: '财报类型',
      dataIndex: 'financialType',
      hideInTable: true,
      valueType: 'radio',
      valueEnum: {
        1: { text: '单体', status: 'Default' },
        2: { text: '合并', status: 'Default' },
      },
      initialValue: '2',
    },
    {
      title: '来源渠道',
      valueEnum: {
        value1: { text: '同花顺' },
        value2: { text: '企查查' },
        value3: { text: '客户提供' },
      },
      valueType: 'checkbox',
      dataIndex: 'sourceChannel',
      hideInTable: true,
      initialValue: initialSourceChannel,
    },
  ];

  return (
    <PageContainer
      header={{
        title: false,
      }}
    >
      <ProTable<Record<string, any>, Record<string, any>>
        {...defaultTableConfig}
        rowKey="key"
        scroll={{ x: '100%' }}
        search={{
          filterType: 'query',
          defaultCollapsed: false,
          searchText: '财报对比',
          resetText: '条件重置',
        }}
        pagination={false}
        actionRef={tableRef}
        columns={columns}
        toolbar={{
          menu: {
            type: 'tab',
            activeKey: activeKey,
            items: [
              {
                key: 'tab1',
                label: '资产负债表',
              },
              {
                key: 'tab2',
                label: '利润表',
                disabled: true,
              },
              {
                key: 'tab3',
                label: '现金流量表',
                disabled: true,
              },
            ],
            onChange: (key) => {
              setActiveKey(key as string);
            },
          },
        }}
        onRow={(record) => ({
          style: compareAndSetRowStyle(record, sourceChannel),
        })}
        tableRender={(_, dom) => (
          <Flex gap="middle">
            {dom}
            <div style={{ width: 250 }}>
              <Steps
                direction="vertical"
                size="small"
                current={1}
                items={[
                  { title: '财报比对', description: '财务报表科目项比对' },
                  {
                    title: '指标分析结果',
                    description: <Result />,
                  },
                ]}
              />
            </div>
          </Flex>
        )}
        params={{ update: data }}
        request={async ({ periods, sourceChannel = [] }) => {
          await waitTime(1000);
          setSourceChannel(sourceChannel);
          setPeriods(periods);
          const arr = data?.[periods] || [];
          // 过滤数据并只保留指定字段以及固定的key和type字段
          const filteredData = arr.map((item) => {
            const partialItem = { key: item.key, type: item.type };
            return Object.assign(
              partialItem,
              ...(sourceChannel as string[]).map((field) => ({ [field]: item[field] })),
            );
          });

          return {
            data: filteredData,
            success: true,
          };
        }}
      />
      <Exception open={modalVisit} onOpenChange={setModalVisit} />
    </PageContainer>
  );
};

export default EarningsComparison;
