import dotenv from 'dotenv';
dotenv.config();

export const MOBILE_MONEY_PROVIDERS = {
  MTN: {
    name: 'MTN MoMo',
    baseUrl: 'https://api.mtn.com/momo',
    apiKey: process.env.MTN_MOMO_API_KEY,
    currency: 'SSP'
  },
  MPESA: {
    name: 'M-Pesa',
    baseUrl: 'https://api.safaricom.co.ke/mpesa',
    apiKey: process.env.MPESA_API_KEY,
    currency: 'KES'
  }
};

