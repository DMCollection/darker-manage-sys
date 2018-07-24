module.exports = {
  chainWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      config
          .plugin('uglify')
          .tap(([options]) => {
            // 去除 console.log
            return [Object.assign(options, {
              uglifyOptions: {
                compress: {
                  drop_console: true,
                  pure_funcs: ['console.log']
                }
              }
            })]
          })
    }
  }
};
