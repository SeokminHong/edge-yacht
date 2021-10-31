import { useContext } from 'react';
import { navigate } from 'gatsby';

import { diceShake, diceRoll } from '~audios';
import OutgameLayout from '~components/OutgameLayout';
import SEO from '~components/SEO';
import LocaleContext from '~contexts/LocaleContext';
import { locales, isLocale } from '~utils/locale';

const IndexPage = () => {
  const { locale, setLocale } = useContext(LocaleContext);

  return (
    <>
      <SEO title="Home Page" />
      <OutgameLayout>
        <button
          onClick={async () => {
            fetch('/api/create')
              .then((res) => res.json())
              .then((body) => {
                return navigate(`/waiting?id=${body.id}`);
              });
          }}
        >
          Create
        </button>
        <select
          onChange={(e) =>
            isLocale(e.target.value) && setLocale(e.target.value)
          }
          value={locale}
        >
          {locales.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
        <button onClick={() => diceShake.play()}>Shake</button>
        <button onClick={() => diceRoll.play()}>Roll</button>
      </OutgameLayout>
    </>
  );
};

export default IndexPage;
