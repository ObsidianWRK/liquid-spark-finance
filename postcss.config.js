export default {
  plugins: {
    tailwindcss: {},
    'postcss-preset-env': {
      stage: 3, // Use stage 3 to include more modern features by default
      features: {
        // Correctly enable backdrop-filter
        'backdrop-filter-property': true,
        // Keep other useful features enabled
        'custom-properties': {
          preserve: true,
        },
        'custom-media-queries': true,
        'media-query-ranges': true,
      },
      // Consolidate browser targets here
      browsers: [
        'last 2 versions',
        'iOS >= 12',
        'Safari >= 12',
        'Chrome >= 80',
        'Firefox >= 75',
        'Edge >= 80',
        'Samsung >= 10',
      ],
    },
    // Optimize CSS for production
    ...(process.env.NODE_ENV === 'production' && {
      cssnano: {
        preset: [
          'default',
          {
            discardComments: {
              removeAll: true,
            },
          },
        ],
      },
    }),
  },
};
