import { ChainId, ENDPOINT_IDS } from "../dataMappings";
// Auto generated in an ethers-v5 repo
const polygonContract = {
    eid: ENDPOINT_IDS[ChainId.POLYGON],
    contractName: 'Settlement',
    address: '0x1280Bdbe692fA1ae7b69B9356daD6Cc211cbEA41'
}

const mantleContract = {
    eid: ENDPOINT_IDS[ChainId.MANTLE],
    contractName: 'Settlement',
    address: '0x1d051eeD29Df13E1A1d1546329E54036A57AEb77'
}

export default {
    contracts: [{
        contract: mantleContract
    },
    { contract: polygonContract }],
    connections: [{
        from: mantleContract,
        to: polygonContract,
        config: {
            sendLibrary: "0xde19274c009A22921E3966a1Ec868cEba40A5DaC",
            receiveLibraryConfig: {
                receiveLibrary: "0x8da6512De9379fBF4F09BF520Caf7a85435ed93e",
                gracePeriod: 0
            },
            sendConfig: {
                executorConfig: {
                    maxMessageSize: 10000,
                    executor: "0x4Fc3f4A38Acd6E4cC0ccBc04B3Dd1CCAeFd7F3Cd"
                },
                ulnConfig: {
                    confirmations: 2,
                    requiredDVNs: ["0x28B6140ead70cb2Fb669705b3598ffB4BEaA060b"],
                    optionalDVNs: [],
                    optionalDVNThreshold: 0
                }
            },
            receiveConfig: {
                ulnConfig: {
                    confirmations: 512,
                    requiredDVNs: ["0x23DE2FE932d9043291f870324B74F820e11dc81A"],
                    optionalDVNs: [],
                    optionalDVNThreshold: 0
                }
            }
        }
    },
    {
        from: polygonContract,
        to: mantleContract,
        config: {
            sendLibrary: "0x6c26c61a97006888ea9E4FA36584c7df57Cd9dA3",
            receiveLibraryConfig: {
                receiveLibrary: "0x1322871e4ab09Bc7f5717189434f97bBD9546e95",
                gracePeriod: 0
            },
            sendConfig: {
                executorConfig: {
                    maxMessageSize: 10000,
                    executor: "0xCd3F213AD101472e1713C72B1697E727C803885b"
                },
                ulnConfig: {
                    confirmations: 512,
                    requiredDVNs: ["0x23DE2FE932d9043291f870324B74F820e11dc81A"],
                    optionalDVNs: [],
                    optionalDVNThreshold: 0
                }
            },
            receiveConfig: {
                ulnConfig: {
                    confirmations: 2,
                    requiredDVNs: ["0x28B6140ead70cb2Fb669705b3598ffB4BEaA060b"],
                    optionalDVNs: [],
                    optionalDVNThreshold: 0
                }
            }
        }
    }]
};
