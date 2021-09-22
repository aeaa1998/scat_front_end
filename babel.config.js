module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          "@protocol": "./src/protocol"
        }
      },

    ]
  ]
}
