import { AvatarDropdown, AvatarName, Footer } from '@/components';
import { LinkOutlined } from '@ant-design/icons';
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import type { RunTimeLayoutConfig } from '@umijs/max';
import { Link, history } from '@umijs/max';
import defaultSettings from '../config/defaultSettings';
import UnAccessible from './pages/403';
import { errorConfig } from './requestErrorConfig';
const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

// 主题css 变量注入

import { ConfigProvider } from 'antd';
import { waitTime } from './pages/EarningsComparison/utils';
ConfigProvider.config({
  theme: {
    primaryColor: '#13c2c2',
    successColor: '#52c41a',
    errorColor: '#ff4d4f',
    warningColor: '#faad14',
  },
});

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  loading?: boolean;
}> {
  const fetchUserInfo = async () => {
    try {
      await waitTime(1000);
      return {
        name: '李开心',
        avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=1',
        userid: '52EbC20E-20fd-74CE-337B-a5F69deeE871',
        email: 's.cbbvov@ccl.lu',
        signature: '型几据院但要指交管象引到此。',
        title: '员对流面效原会从成些单声场次气。',
        group: '服务技术部',
        tags: [
          { key: 1, label: '名望程序员' },
          { key: 2, label: '阳光少年' },
          { key: 3, label: '名望程序员' },
          { key: 4, label: '程序员' },
          { key: 5, label: '专注设计' },
          { key: 6, label: '海纳百川' },
          { key: 7, label: '专注设计' },
          { key: 8, label: '名望程序员' },
          { key: 9, label: '程序员' },
        ],
        notifyCount: 78,
        unreadCount: 86,
        country: '墨西哥',
        access: '太间究调难积车龙好全小京导类采低识。',
        geographic: { province: { label: '湖南省', key: 10 }, city: { label: '洛阳市', key: 11 } },
        address: '江苏省 徐州市 睢宁县',
        phone: '11255057362',
      };
      // const msg = await queryCurrentUser();
      // return msg?.data;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };
  // 如果不是登录页面，执行
  const { location } = history;
  if (location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    return {
      // @ts-ignore
      currentUser,
      settings: defaultSettings as Partial<LayoutSettings>,
    };
  }
  return {
    settings: defaultSettings as Partial<LayoutSettings>,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    avatarProps: {
      // src: initialState?.currentUser?.avatar || '/images/user.svg',
      title: <AvatarName />,
      render: (_, avatarChildren) => {
        return <AvatarDropdown>{avatarChildren}</AvatarDropdown>;
      },
    },
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },

    links: isDev
      ? [
          <Link key="openapi" to="/umi/plugin/openapi" target="_blank">
            <LinkOutlined />
            <span>OpenAPI 文档</span>
          </Link>,
        ]
      : [],
    menuHeaderRender: undefined,
    unAccessible: <UnAccessible />,
    ...initialState?.settings,
  };
};

/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request = {
  ...errorConfig,
};
