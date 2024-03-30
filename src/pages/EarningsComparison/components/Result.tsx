import { defaultTableConfig } from '@/utils/setting';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { ModalForm, ProColumns, ProTable } from '@ant-design/pro-components';
import { Space, Tooltip, Typography } from 'antd';
import { resultData } from '../data';

const { Text, Title } = Typography;

const isInRangeFn = (value: string, min: string, max: string): boolean => {
  const parsedValue = Number(value.replace('%', ''));
  const parsedMin = Number(min.replace('%', ''));
  const parsedMax = Number(max.replace('%', ''));
  return parsedMin <= parsedValue && parsedValue <= parsedMax;
};

const renderValueColumn = (text: string, record: any) => {
  const isInRange = isInRangeFn(text, record.min, record.max);
  if (isInRange) return text;
  return (
    <Tooltip title={`${record.min}-${record.max}`} color="green" placement="right">
      <Title level={4} type="danger" style={{ display: 'inline-block' }}>
        {text}
      </Title>
    </Tooltip>
  );
};

const columns: ProColumns<any>[] = [
  {
    title: '项目',
    dataIndex: 'type',
    width: 100,
  },
  {
    title: '同花顺',
    dataIndex: 'value1',
    width: 100,
    render: (_, record) => renderValueColumn(record.value1, record),
  },
  {
    title: '企查查',
    dataIndex: 'value2',
    width: 100,
    render: (_, record) => renderValueColumn(record.value2, record),
  },
  {
    title: '客户提供',
    dataIndex: 'value3',
    width: 100,
    render: (_, record) => renderValueColumn(record.value3, record),
  },
];

const Result = () => {
  return (
    <ModalForm
      title="指标分析结果"
      trigger={
        <Space align="start">
          <ExclamationCircleFilled style={{ color: '#f50' }} />
          <Text type="secondary" style={{ cursor: 'pointer' }}>
            同花顺和客户提供财报计算 出来的财务指标偏离度过大
          </Text>
        </Space>
      }
      autoFocusFirstInput
      submitter={false}
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
        dataSource={resultData}
      />
    </ModalForm>
  );
};

export default Result;
