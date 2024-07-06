"use client";

import React, { useState } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { useTranslation } from "@/i18n/client";
import { createBubbleGumTrees } from "../../components/utils";
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

  const createTree = async () => {
    try {
      if (!wallet) {
        console.error("Wallet not connected");
        return;
      }

      setIsLoading(true); // ボタンを押した後にローディング状態を設定

      const tx = await createBubbleGumTrees(wallet);
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
        <div className="flex justify-center mt-4">
          <button
            onClick={createTree}
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
              "Treeを作成"
            )}
          </button>
        </div>

        {explorerURL && (
          <>
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
