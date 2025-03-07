import { IpFilter } from 'express-ipfilter';

const blockedIps = ['192.168.1.1', '203.0.113.0']; // Add any known malicious IPs

export const ipBlocker = IpFilter(blockedIps, {
  mode: 'deny',
  log: true,
  allowedHeaders: ['x-forwarded-for'],
  detectIp: (req) => req.headers['x-forwarded-for'] || req.ip,
});

