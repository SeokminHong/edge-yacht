import styled from '@emotion/styled';
import { UPPER_SECTION, LOWER_SECTION } from 'shared';

import BonusRow from './BonusRow';
import ScoreRow from './ScoreRow';
import TotalRow from './TotalRow';

const ScoreCard = () => {
  return (
    <CardWrapper>
      {UPPER_SECTION.map((s) => (
        <ScoreRow key={`row-${s}`} section={s} />
      ))}
      <BonusRow />
      {LOWER_SECTION.map((s) => (
        <ScoreRow key={`row-${s}`} section={s} />
      ))}
      <TotalRow />
    </CardWrapper>
  );
};

const CardWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 4em 4em;
  margin: 0;

  & > div {
    height: 2em;
    line-height: 2em;
  }
  & > button:not(:disabled) {
    cursor: pointer;
    :hover {
      background-color: yellow;
    }
  }
  & > .cell {
    padding: 0 16px;
    background: none;
    border: none;
    border-right: 2px solid black;
    border-bottom: 2px solid black;
    font-size: 1rem;
    font-family: sans-serif;
  }
  & > .score {
    text-align: center;
    color: gray;
    &.confirmed {
      color: black;
    }
  }
`;

export default ScoreCard;
