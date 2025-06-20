export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {
      // Enhanced browser support for liquid glass effects
      overrideBrowserslist: [
        'iOS >= 12',
        'Safari >= 12',
        'Chrome >= 80',
        'Firefox >= 75',
        'Edge >= 80',
        'Samsung >= 10'
      ],
      // Add vendor prefixes for backdrop-filter
      grid: 'autoplace',
      flexbox: 'no-2009'
    },
    // Add browser-specific prefixes for glass effects
    'postcss-preset-env': {
      stage: 2,
      features: {
        'custom-properties': {
          preserve: true
        },
        'custom-media-queries': true,
        'media-query-ranges': true,
        'backdrop-filter': true,
      },
      browsers: 'last 2 versions, iOS >= 12, Safari >= 12'
    },
    // Optimize CSS for production
    ...(process.env.NODE_ENV === 'production' && {
      cssnano: {
        preset: ['default', {
          discardComments: {
            removeAll: true,
          },
          // Preserve backdrop-filter properties
          reduceIdents: false,
          zindex: false,
        }]
      }
    })
  }
}
