import { ProLayoutProps } from '@ant-design/pro-components';

/**
 * @name
 */
const defaultSettings: ProLayoutProps & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'light',
  // 明青 Cyan-6
  colorPrimary: '#13c2c2',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: 'Evil Pro Cli',
  pwa: true,
  logo: '/images/logo.png',
  iconfontUrl: '',
  token: {
    sider: {
      colorTextMenuSelected: '#13c2c2',
      colorTextMenuActive: '#13c2c2',
      colorTextMenuItemHover: '#13c2c2',
    },
    header: {
      colorTextRightActionsItem: 'rgba(0, 0, 0, 0.88)',
    },
  },
};

export default defaultSettings;
