module.exports = {
  apps: [
    {
      name: 'sync-app',
      script:
        './node_modules/.bin/cross-env NODE_ENV=production node --es-module-specifier-resolution=node ./index.js',
      watch: false,
      max_memory_restart: '600M',
      max_restarts: 10,
      restart_delay: 2000,
      env_development: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
