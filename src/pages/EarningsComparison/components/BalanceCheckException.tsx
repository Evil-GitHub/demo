import { ExclamationCircleFilled } from '@ant-design/icons';
import { Space, Typography } from 'antd';
import { FC } from 'react';
const { Text } = Typography;

interface BalanceCheckExceptionProps {
  onClick?: () => void;
}

const BalanceCheckException: FC<BalanceCheckExceptionProps> = ({ onClick }) => {
  return (
    <Space onClick={onClick}>
      <ExclamationCircleFilled style={{ color: '#f50' }} />
      <Text type="secondary" style={{ cursor: 'pointer' }}>
        平衡校验异常
      </Text>
    </Space>
  );
};

export default BalanceCheckException;
