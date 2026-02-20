import axios from 'axios';
import { getConfig } from './config.js';

const OBP_BASE_URL = 'https://api.dev.openbankingproject.ch/v1';

async function apiRequest(method, endpoint, data = null, params = null) {
  const accessToken = getConfig('accessToken');

  if (!accessToken) {
    throw new Error('Access token not configured. Run: obpswiss config set --token <token>');
  }

  const config = {
    method,
    url: `${OBP_BASE_URL}${endpoint}`,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  };

  if (params) config.params = params;
  if (data) config.data = data;

  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

function handleApiError(error) {
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;

    if (status === 401) {
      throw new Error('Authentication failed. Check your access token.');
    } else if (status === 403) {
      throw new Error('Access forbidden.');
    } else if (status === 404) {
      throw new Error('Resource not found.');
    } else if (status === 429) {
      throw new Error('Rate limit exceeded.');
    } else {
      const message = data?.message || JSON.stringify(data);
      throw new Error(`API Error (${status}): ${message}`);
    }
  } else if (error.request) {
    throw new Error('No response from OBP API. Check your internet connection.');
  } else {
    throw error;
  }
}

// ACCOUNTS
export async function listAccounts(params = {}) {
  const data = await apiRequest('GET', '/accounts', null, params);
  return data.accounts || [];
}

export async function getAccount(accountId) {
  const data = await apiRequest('GET', `/accounts/${accountId}`);
  return data || null;
}

export async function getAccountBalances(accountId) {
  const data = await apiRequest('GET', `/accounts/${accountId}/balances`);
  return data.balances || [];
}

export async function listAccountTransactions(accountId, params = {}) {
  const data = await apiRequest('GET', `/accounts/${accountId}/transactions`, null, params);
  return data.transactions || [];
}

export async function getTransaction(accountId, transactionId) {
  const data = await apiRequest('GET', `/accounts/${accountId}/transactions/${transactionId}`);
  return data || null;
}

// CONSENTS
export async function createConsent(consentData) {
  const data = await apiRequest('POST', '/consents', consentData);
  return data || null;
}

export async function getConsent(consentId) {
  const data = await apiRequest('GET', `/consents/${consentId}`);
  return data || null;
}

export async function getConsentStatus(consentId) {
  const data = await apiRequest('GET', `/consents/${consentId}/status`);
  return data || null;
}

export async function deleteConsent(consentId) {
  await apiRequest('DELETE', `/consents/${consentId}`);
  return true;
}

// AUTHORIZATIONS
export async function createAuthorization(consentId, authData) {
  const data = await apiRequest('POST', `/consents/${consentId}/authorisations`, authData);
  return data || null;
}

export async function getAuthorization(consentId, authorizationId) {
  const data = await apiRequest('GET', `/consents/${consentId}/authorisations/${authorizationId}`);
  return data || null;
}

export async function updateAuthorization(consentId, authorizationId, authData) {
  const data = await apiRequest('PUT', `/consents/${consentId}/authorisations/${authorizationId}`, authData);
  return data || null;
}

// PAYMENTS
export async function initiatePayment(paymentService, paymentProduct, paymentData) {
  const data = await apiRequest('POST', `/${paymentService}/${paymentProduct}`, paymentData);
  return data || null;
}

export async function getPaymentStatus(paymentService, paymentProduct, paymentId) {
  const data = await apiRequest('GET', `/${paymentService}/${paymentProduct}/${paymentId}/status`);
  return data || null;
}

// SIGNING BASKETS
export async function createSigningBasket(basketData) {
  const data = await apiRequest('POST', '/signing-baskets', basketData);
  return data || null;
}

export async function getSigningBasket(basketId) {
  const data = await apiRequest('GET', `/signing-baskets/${basketId}`);
  return data || null;
}

// FUNDS CONFIRMATIONS
export async function confirmFunds(confirmationData) {
  const data = await apiRequest('POST', '/funds-confirmations', confirmationData);
  return data || null;
}
