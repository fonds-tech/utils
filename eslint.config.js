import eslint from '@fonds/eslint-config'

export default eslint(
  {
    type: 'lib',
    pnpm: true,
    markdown: true,
    typescript: true,
    formatters: true,
  },
)
