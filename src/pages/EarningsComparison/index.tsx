import { defaultTableConfig } from '@/utils/setting';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Flex, Space, Steps } from 'antd';
import React, { useMemo, useRef, useState } from 'react';
import BalanceCheckException from './components/BalanceCheckException';
import Exception from './components/Exception';
import Result from './components/Result';

import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn'; // 根据需要引入对应的语言包
import { waitTime } from './utils';

// 在应用启动时全局设置 dayjs 的语言环境
dayjs.locale('zh-cn'); // 将其替换为你需要的语言环境

function compareValues(value1: number, value2: number, value3: number): boolean {
  return value1 !== value2 || value1 !== value3 || value2 !== value3;
}

const greenColor = '#87d068'; // 定义绿色
const redColor = '#f50'; // 定义红色

const compareAndSetRowStyle = (record: any) => {
  const inconsistent = compareValues(record.value1, record.value2, record.value3);
  const rowStyle: React.CSSProperties = {
    backgroundColor: '#f6ffed',
  };
  if (inconsistent) {
    rowStyle.backgroundColor = 'yellow'; // 设置为黄色背景
  }
  return rowStyle;
};

const initialSourceChannel = ['1', '2', '3'];

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
      render: (text, record) => {
        const color =
          record.value1 === record.value2 || record.value1 === record.value3
            ? greenColor
            : redColor;
        return <span style={{ color }}>{text}</span>;
      },
      hideInTable: !sourceChannel.includes('1'),
    },
    {
      title: '企查查',
      dataIndex: 'value2',
      width: 250,
      hideInSearch: true,
      render: (text, record) => {
        const color =
          record.value2 === record.value1 || record.value2 === record.value3
            ? greenColor
            : redColor;
        return <span style={{ color }}>{text}</span>;
      },
      hideInTable: !sourceChannel.includes('2'),
    },
    {
      title: '客户提供',
      dataIndex: 'value3',
      width: 250,
      hideInSearch: true,
      render: (text, record) => {
        const color =
          record.value3 === record.value1 || record.value3 === record.value2
            ? greenColor
            : redColor;
        return <span style={{ color }}>{text}</span>;
      },
      hideInTable: !sourceChannel.includes('3'),
    },
    {
      title: '客户',
      dataIndex: 'consumer',
      hideInTable: true,
      valueEnum: {
        1: { text: '客户1', status: 'Default' },
        2: { text: '客户2', status: 'Default' },
        3: { text: '客户3', status: 'Default' },
      },
      initialValue: '1',
    },
    {
      title: '财报期数',
      dataIndex: 'periods',
      hideInTable: true,
      initialValue: '2024-03',
      valueType: 'dateMonth',
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
        1: { text: '同花顺' },
        2: { text: '企查查' },
        3: { text: '客户提供' },
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
          style: compareAndSetRowStyle(record),
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
          return {
            data: arr,
            success: true,
          };
        }}
      />
      <Exception open={modalVisit} onOpenChange={setModalVisit} />
    </PageContainer>
  );
};

export default EarningsComparison;
