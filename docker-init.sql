SELECT 'CREATE DATABASE happy_test'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'happy_test')\gexec
