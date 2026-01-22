"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_REFRESH_EXPIRE = exports.JWT_EXPIRE = exports.JWT_REFRESH_SECRET = exports.JWT_SECRET = void 0;
exports.JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
exports.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';
exports.JWT_EXPIRE = '15m';
exports.JWT_REFRESH_EXPIRE = '7d';
