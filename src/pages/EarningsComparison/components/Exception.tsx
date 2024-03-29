import { defaultTableConfig } from '@/utils/setting';
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import { ModalForm, ModalFormProps, ProColumns, ProTable } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Space } from 'antd';
import { FC } from 'react';
import EditorTable from './EditorTable';

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

const Exception: FC<ModalFormProps> = (props) => {
  const { exceptionData } = useModel('EarningsComparison.model', (model) => ({
    updateRecord: model.updateRecord,
    exceptionData: model.exceptionData,
  }));

  return (
    <ModalForm title="表内公示平衡校验" autoFocusFirstInput submitter={false} {...props}>
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
      <EditorTable />
    </ModalForm>
  );
};

export default Exception;
