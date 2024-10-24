import { Address, beginCell, toNano } from '@ton/core';
import { TonConnectButton, useTonAddress, useTonConnectUI } from '@tonconnect/ui-react';
import './App.css';
import { COLLECTION_ADDRESS, JETTON_DECIMALS, JETTON_MINTER_ADDRESS, JETTON_PRICE, tonapi } from './consts';

export default function App() {
  const address = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();

  const calculateJettonWalletAddress = async (minterAddress: string, ownerAddress: string): Promise<string> => {
    type Response = {
      success: boolean;
      exit_code: number;
      stack: {
        type: string;
        cell: string;
      }[];
      decoded: {
        jetton_wallet_address: string;
      };
    };
    const response = (await tonapi.get)<Response>(`/v2/blockchain/accounts/${minterAddress}/methods/get_wallet_address?args=${ownerAddress}`);
    return (await response).data.decoded.jetton_wallet_address;
  };

  const createBodyTransaction = async (userWalletAddress: string) => {
    const userJettonWalletAddress: string = await calculateJettonWalletAddress(JETTON_MINTER_ADDRESS, userWalletAddress);
    //0:3d6d2c0e31fcb9cca0498f4af1f5dd31df92522690b93c2b6f3ec3f66a41f40b
    if (!userJettonWalletAddress) throw new Error('userJettonWalletAddress is undefined');

    const body = beginCell()
      .storeUint(0xf8a7ea5, 32)
      .storeUint(Math.floor(Date.now() / 1000), 64)
      .storeCoins(JETTON_PRICE * 10 ** JETTON_DECIMALS)
      .storeAddress(Address.parse(COLLECTION_ADDRESS)) // адрес смарта
      .storeUint(0, 2) // response address -- null
      .storeUint(0, 1)
      .storeCoins(toNano('0.01'))
      .storeBit(0)
      .endCell();

    const transaction = {
      validUntil: Math.floor(Date.now() / 1000) + 60,
      messages: [
        {
          address: userJettonWalletAddress,
          amount: toNano('0.05').toString(), // Коммисия тоном
          payload: body.toBoc().toString('base64'),
        },
      ],
    };

    return transaction;
  };

  const mintNft = async () => {
    const transaction = await createBodyTransaction(address);
    if (!transaction) throw new Error('Transaction not created');
    console.log(transaction);

    tonConnectUI.sendTransaction(transaction);
  };
  return (
    <>
      <TonConnectButton />
      <h1>Mint NFT</h1>

      <button onClick={mintNft}>Сминтить</button>
    </>
  );
}
