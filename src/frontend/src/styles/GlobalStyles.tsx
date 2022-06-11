import React from 'react';
import { Global } from '@emotion/react';
import tw, { css, GlobalStyles as BaseStyles, globalStyles } from 'twin.macro';

const customStyles = css({
  ...globalStyles,
  html: {
    ...(globalStyles.html as any),
    fontFamily: `'Inter', sans-serif`,
    fontSize: 14,
  },
  body: {
    ...(globalStyles.body as any),
    ...tw`antialiased`,
  },
});

const GlobalStyles = () => <Global styles={customStyles} />;

export default GlobalStyles;
