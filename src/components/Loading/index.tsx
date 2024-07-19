import { Spin, Typography } from 'antd';
import styles from './index.less';

const Loading = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Spin spinning size="large" style={{ marginBlockEnd: 16 }} />
        <Typography.Title level={5}>正在加载数据</Typography.Title>
        <Typography.Text>加载中，请耐心等待。</Typography.Text>
      </div>
    </div>
  );
};

export default Loading;
