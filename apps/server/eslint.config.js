import js from '@eslint/js'
import globals from 'globals'

export default [
  js.configs.recommended,

  {
    languageOptions: {
      globals: {
        ...globals.node, // Add Node.js global variables
      },
      // Specify ECMAScript version and module type
      ecmaVersion: 2024,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          impliedStrict: true,
        },
      },
    },
  },
]
