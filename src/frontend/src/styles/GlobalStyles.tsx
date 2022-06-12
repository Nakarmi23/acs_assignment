import { Global } from '@emotion/react';
import tw, { css, globalStyles } from 'twin.macro';

const customStyles = css({
  ...globalStyles,
  html: {
    ...(globalStyles.html as any),
    fontFamily: `'Inter', sans-serif`,
    fontSize: 14,
    ...tw`text-neutral-700`,
  },
  body: {
    ...(globalStyles.body as any),
    ...tw`antialiased`,
  },
});

const GlobalStyles = () => <Global styles={customStyles} />;

export default GlobalStyles;
