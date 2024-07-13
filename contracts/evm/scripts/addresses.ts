export  enum ChainId {
    MANTLE = 5000,
    POLYGON = 137,
    ARBITRUM = 42161,
}

export const SETTLEMENT_ADDRESSES = {
    [ChainId.MANTLE]: '',
    [ChainId.POLYGON]: '',
    [ChainId.ARBITRUM]: '',
}

export const ENDPOINT_ADDRESSES = {
    [ChainId.MANTLE]: '0x1a44076050125825900e736c501f859c50fE728c',
    [ChainId.POLYGON]: '0x1a44076050125825900e736c501f859c50fE728c',
    [ChainId.ARBITRUM]: '0x1a44076050125825900e736c501f859c50fE728c',
}

export const ENDPOINT_IDS = {
    [ChainId.MANTLE]: 1,
    [ChainId.POLYGON]: 1,
    [ChainId.ARBITRUM]: 1,
}