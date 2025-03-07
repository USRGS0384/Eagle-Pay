import axios from 'axios';
import { MOBILE_MONEY_PROVIDERS } from '../config/mobileMoney.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Send money to mobile money account
 * @param {string} provider - MTN or MPESA
 * @param {string} phoneNumber - Recipient phone number
 * @param {number} amount - Amount to send
 * @returns {object} - Transaction response
 */
export const sendMoney = async (provider, phoneNumber, amount) => {
  if (!MOBILE_MONEY_PROVIDERS[provider]) {
    throw new Error('Invalid mobile money provider');
  }

  const { baseUrl, apiKey, currency } = MOBILE_MONEY_PROVIDERS[provider];

  try {
    const response = await axios.post(
      `${baseUrl}/send-money`,
      { phoneNumber, amount, currency },
      { headers: { Authorization: `Bearer ${apiKey}` } }
    );

    return response.data;
  } catch (error) {
    throw new Error(`Failed to send money: ${error.response?.data?.message || error.message}`);
  }
};

/**
 * Deposit money from mobile money to Eagle Pay
 * @param {string} provider - MTN or MPESA
 * @param {string} phoneNumber - Sender phone number
 * @param {number} amount - Amount to deposit
 * @returns {object} - Transaction response
 */
export const depositMoney = async (provider, phoneNumber, amount) => {
  if (!MOBILE_MONEY_PROVIDERS[provider]) {
    throw new Error('Invalid mobile money provider');
  }

  const { baseUrl, apiKey, currency } = MOBILE_MONEY_PROVIDERS[provider];

  try {
    const response = await axios.post(
      `${baseUrl}/deposit`,
      { phoneNumber, amount, currency },
      { headers: { Authorization: `Bearer ${apiKey}` } }
    );

    return response.data;
  } catch (error) {
    throw new Error(`Failed to deposit money: ${error.response?.data?.message || error.message}`);
  }
};
// MTN MoMo API Configuration
const MTN_BASE_URL = 'https://sandbox.momodeveloper.mtn.com';
const M_PESA_BASE_URL = 'https://api.safaricom.co.ke';

// Function to generate MTN MoMo access token
export const getMtnToken = async () => {
  try {
    const response = await axios.post(
      `${MTN_BASE_URL}/collection/token/`,
      {},
      {
        headers: {
          'Ocp-Apim-Subscription-Key': process.env.MTN_SUBSCRIPTION_KEY,
          'X-Reference-Id': process.env.MTN_REFERENCE_ID,
          'X-Target-Environment': 'sandbox', // Change to "production" for live
        },
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error('MTN MoMo Token Error:', error.response?.data || error.message);
    throw new Error('Failed to fetch MTN MoMo token');
  }
};

// Function to generate M-Pesa access token
export const getMpesaToken = async () => {
  try {
    const auth = Buffer.from(`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`).toString('base64');
    const response = await axios.get(`${M_PESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
      headers: { Authorization: `Basic ${auth}` },
    });
    return response.data.access_token;
  } catch (error) {
    console.error('M-Pesa Token Error:', error.response?.data || error.message);
    throw new Error('Failed to fetch M-Pesa token');
  }
};
