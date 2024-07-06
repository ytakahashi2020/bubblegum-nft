"use client";

import React, { useState } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { useTranslation } from "@/i18n/client";
import {
  createNFTUsingAkord,
  createBubbleGumTrees,
} from "../../components/utils";
import { PageParams } from "../../types/params";
import { ClipLoader } from "react-spinners"; // スピナーをインポート

const MyPage: React.FC<PageParams> = ({ params: { lng } }) => {
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const { t } = useTranslation(lng, "my_page");
  const [isLoading, setIsLoading] = useState(false); // ローディング状態を追加
  const [explorerURL, setExplorerURL] = useState<string | null>(null);
  const [nftData, setNftData] = useState({
    name: "",
    symbol: "",
    description: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNftData((prevData) => ({ ...prevData, [name]: value }));
  };

  const createNFT = async () => {
    try {
      if (!wallet) {
        console.error("Wallet not connected");
        return;
      }

      setIsLoading(true); // ボタンを押した後にローディング状態を設定

      // const data = {
      //   name: nftData.name,
      //   symbol: nftData.symbol,
      //   description: nftData.description,
      //   image:
      //     "https://arweave.net/5PGFryeL2J8YkcehPQzEmgQCfD438F1Iws-ZcPFKwDg", // 固定された画像URL
      //   attributes: [], // 他の属性が必要であれば追加してください
      // };
      // const tokenID = await createNFTUsingAkord(data, wallet); // Akordにデータを保存し、NFTを作成
      const tx = await createBubbleGumTrees(wallet);
      console.log("tx =>", tx);
      const url = `https://explorer.solana.com/address/${tx}?cluster=devnet`;
      setExplorerURL(url); // エクスプローラのURLを状態に保存
    } catch (error) {
      console.error("Error saving JSON to Akord: ", error);
    } finally {
      setIsLoading(false); // 処理が完了した後にローディング状態を解除
    }
  };

  if (!wallet) {
    return <div>{t("my_page.connect_wallet")}</div>;
  }

  return (
    <div className="min-h-screen bg-kumogray flex items-center justify-center p-4">
      <div className="max-w-5xl w-full bg-white p-8 rounded-lg shadow-lg ">
        <h1 className="text-3xl font-bold mb-6">{t("my_page.create_nft")}</h1>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            {t("my_page.nft_name")}
          </label>
          <input
            name="name"
            type="text"
            value={nftData.name}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            {t("my_page.nft_symbol")}
          </label>
          <input
            name="symbol"
            type="text"
            value={nftData.symbol}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            {t("my_page.nft_description")}
          </label>
          <input
            name="description"
            type="text"
            value={nftData.description}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="flex justify-center mt-4">
          <button
            onClick={createNFT}
            className={`px-6 py-3 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 min-w-60 ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-namiblue hover:bg-blue-600"
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <ClipLoader size={24} color={"#ffffff"} loading={isLoading} />
                <span className="ml-2">{t("my_page.processing")}</span>
              </div>
            ) : (
              t("my_page.issue_nft")
            )}
          </button>
        </div>

        {explorerURL && (
          <>
            <p className="mt-4 text-gray-700">
              {t("my_page.nft_reflection_message")}
            </p>
            <a
              href={explorerURL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 w-full block text-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              {t("my_page.view_on_explorer")}
            </a>
          </>
        )}
      </div>
    </div>
  );
};

export default MyPage;
