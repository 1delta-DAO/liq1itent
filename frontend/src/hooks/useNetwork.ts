import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { Network, networks } from "../config/networks.config";

interface UseNetworkValue {
  network: Network | undefined;
  connectedNetwork: Network | undefined;
}

export const useNetwork = (): UseNetworkValue => {
  const [network, setNetwork] = useState<Network>();
  const [connectedNetwork, setConnectedNetwork] = useState<Network>();
  const { chainId } = useWeb3React();

  useEffect(() => {
    let networkProposal: Network | undefined = undefined;
    if (chainId) {
      networkProposal = networks.find((n) => n.chainId === chainId);
      if (networkProposal && networkProposal.active) {
        setConnectedNetwork(networkProposal);
      }
    }

    setNetwork(networkProposal);
  }, [chainId]);

  return { connectedNetwork, network };
};
