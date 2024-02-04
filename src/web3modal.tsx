import { createWeb3Modal } from "@web3modal/wagmi/react";
import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import { createSIWEConfig } from "@web3modal/siwe";
import { WagmiProvider } from "wagmi";
import { arbitrum, mainnet } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { SIWECreateMessageArgs } from "@web3modal/core";
import React from "react";
import { getAccount } from "@wagmi/core";
import { SiweMessage } from "siwe";

// 0. Setup queryClient
const queryClient = new QueryClient();

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = "ec4b90a4630d6b046d8fbac5b54e08b4";

// 2. Create wagmiConfig
const metadata = {
  name: "Web3Modal",
  description: "Web3Modal Example",
  url: "https://web3modal.com", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const config = defaultWagmiConfig({
  chains: [mainnet, arbitrum], // required
  projectId, // required
  metadata, // required
  enableWalletConnect: true, // Optional - true by default
  enableInjected: true, // Optional - true by default
  enableEIP6963: true, // Optional - true by default
  enableCoinbase: true, // Optional - true by default
});

const siweConfig = createSIWEConfig({
  createMessage: ({ nonce, address, chainId }: SIWECreateMessageArgs) =>
    new SiweMessage({
      version: "1",
      domain: window.location.host,
      uri: window.location.origin,
      address,
      chainId,
      nonce,
      // Human-readable ASCII assertion that the user will sign, and it must not contain `\n`.
      statement: "Sign in With Ethereum.",
    }).prepareMessage(),
  getNonce: async () => {
    return Math.floor(Math.random() * 1_000_000_000).toString();
  },
  getSession: async () => {
    const sessionString = localStorage.getItem("session-json");
    if (!sessionString) {
      console.error("Failed to get session");
      throw new Error("Failed to get session");
    }
    const session = JSON.parse(sessionString);
    if (!session) {
      throw new Error("Failed to get session!");
    }
    const { address, chainId } = session;
    return { address, chainId };
  },
  verifyMessage: async () => {
    const { address, chainId } = getAccount(config);
    if (address && chainId) {
      localStorage.setItem(
        "session-json",
        JSON.stringify({ address: address, chainId: chainId }),
      );
    }
    return true;
  },
  signOut: async () => {
    return true;
  },
});

// 3. Create modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  siweConfig: siweConfig,
});

export function Web3Modal(props: React.PropsWithChildren) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {props.children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
