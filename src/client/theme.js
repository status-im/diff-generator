import { ThemeProvider, css } from 'fannypack';

export default {
  Column: {
    base: css`
      height: 100%;
    `,
  },
  Container: {
    base: css`
      max-width: none;
      height: 100%;
    `,
  },
  Table: {
    Row: {
      base: css`
        .selected {
          background: yellow;
          border: solid black 2px;
        }
      `,
    }
  },
}
