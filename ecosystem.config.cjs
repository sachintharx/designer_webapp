module.exports = {
  apps: [
    {
      name: 'designer-api',
      script: './server/src/index.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      error_file: './logs/api-err.log',
      out_file: './logs/api-out.log',
      log_file: './logs/api-combined.log',
      time: true
    },
    {
      name: 'designer-client',
      script: 'npx',
      args: 'vite preview --host 0.0.0.0 --port 5173',
      cwd: './client',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production'
      },
      error_file: './logs/client-err.log',
      out_file: './logs/client-out.log',
      log_file: './logs/client-combined.log',
      time: true
    }
  ]
};
