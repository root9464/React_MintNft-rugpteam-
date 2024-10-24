import axios from 'axios';

export const COLLECTION_ADDRESS: string = 'EQBO6eTQ10avMGbbppzr4M6CSR48_Y9A2k9b64NHzYBiWP2f';
export const JETTON_MINTER_ADDRESS: string = 'kQCV7mm9DJbiNETgQRj6zdJJXcLKkd2YPezzKsL1Oo4lQlVp';
export const tonapi = axios.create({
  baseURL: 'https://testnet.tonapi.io',
});

export const JETTON_PRICE: number = 1;
export const JETTON_DECIMALS: number = 9;
