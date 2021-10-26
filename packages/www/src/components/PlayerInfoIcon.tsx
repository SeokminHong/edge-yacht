import { Avatar, ThemingProps } from '@chakra-ui/react';
import { User } from 'shared';

interface IPlayerInfoIconProps {
  user?: User;
  size?: ThemingProps<'Avatar'>['size'];
}

const PlayerInfoIcon = ({ user, size }: IPlayerInfoIconProps) => {
  if (!user) {
    return <Avatar size={size} />;
  }
  return (
    <Avatar
      name={user.nickname}
      src={user.picture}
      alt="Player avatar"
      size={size}
    />
  );
};

export default PlayerInfoIcon;
