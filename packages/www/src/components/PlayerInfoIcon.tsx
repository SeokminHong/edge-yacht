import styled from '@emotion/styled';
import Avatar from 'boring-avatars';
import { PlayerInfo } from 'shared';

interface IPlayerInfoIconProps {
  playerInfo?: PlayerInfo;
  size: number;
}

const palette = ['#99b898', '#fecea8', '#ff847c', '#e84a5f', '#2a363b'];

const PlayerInfoIcon = ({ playerInfo, size }: IPlayerInfoIconProps) => {
  if (!playerInfo) {
    return <PlaceHolder size={size} />;
  }
  if (playerInfo.type === 'guest') {
    return (
      <Avatar
        size={size}
        name={playerInfo.id}
        variant="beam"
        colors={palette}
      />
    );
  }
  return (
    <IconImage src={playerInfo.user.picture} alt="Player avatar" size={size} />
  );
};

const PlaceHolder = styled.div<{ size: number }>`
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  border-radius: 50%;
  background-color: #ccc;
`;

const IconImage = styled.img<{ size: number }>`
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  border-radius: 50%;
`;

export default PlayerInfoIcon;
