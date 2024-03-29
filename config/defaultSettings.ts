import { ProLayoutProps } from '@ant-design/pro-components';

/**
 * @name
 */
const defaultSettings: ProLayoutProps & {
  pwa?: boolean;
  logo?: string;
} = {
  breakpoint: 'xxl',
  navTheme: 'light',
  // 明青 Cyan-6
  colorPrimary: '#13c2c2',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: '金控业务系统',
  pwa: true,
  logo: '/images/logo.png',
  iconfontUrl: '',
  token: {
    sider: {
      colorTextMenuSelected: '#13c2c2',
      colorTextMenuActive: '#13c2c2',
      colorTextMenuItemHover: '#13c2c2',
      colorMenuBackground: '#fff',
    },
    header: {
      colorTextRightActionsItem: 'rgba(0, 0, 0, 0.88)',
    },
    pageContainer: {
      paddingBlockPageContainerContent: 36,
      paddingInlinePageContainerContent: 36,
    },
  },
};

export default defaultSettings;
