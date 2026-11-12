const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const app = express();
const REGISTER_SERVICE_URL = process.env.REGISTER_SERVICE_URL || 'http://localhost:5001';
const SEARCH_SERVICE_URL = process.env.SEARCH_SERVICE_URL || 'http://localhost:5002';

app.get('/health', (req, res) => res.json({ service: 'api-gateway', status: 'ok' }));
app.use('/register', createProxyMiddleware({ target: REGISTER_SERVICE_URL, changeOrigin: true }));
app.use('/search', createProxyMiddleware({ target: SEARCH_SERVICE_URL, changeOrigin: true }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API Gateway running on port ${PORT}`));