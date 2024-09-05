import { getGradientColorFromCharCode } from '@/utils';
import { Avatar as AntAvatar, AvatarProps } from 'antd';
import { FC } from 'react';

const Avatar: FC<
  AvatarProps & {
    name: string;
  }
> = ({ name = '', ...restProps }) => {
  return (
    <AntAvatar style={getGradientColorFromCharCode(name?.charCodeAt(1))} {...restProps}>
      {name.slice(-2)}
    </AntAvatar>
  );
};

export default Avatar;
