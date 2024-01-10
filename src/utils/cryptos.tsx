export const cryptos = {
    Bitcoin: {
        name: "Bitcoin",
        symbol: "BINANCE:BTCUSDT",
    },
    Ethereum: {
        name: "Ethereum",
        symbol: "BINANCE:ETHUSDT",
    },
    BinanceCoin: {
        name: "Binance Coin",
        symbol: "BINANCE:BNBUSDT",
    },
    Cardano: {
        name: "Cardano",
        symbol: "BINANCE:ADAUSDT",
    },
    Solana: {
        name: "Solana",
        symbol: "BINANCE:SOLUSDC",
    },
    Terra: {
        name: "Terra",
        symbol: "BINANCE:LUNAUSDT",
    },
    Avalanche: {
        name: "Avalanche",
        symbol: "BINANCE:AVAXUSDT",
    },
    Polkadot: {
        name: "Polkadot",
        symbol: "BINANCE:DOTUSDT",
    },
    Polygon: {
        name: "Polygon",
        symbol: "BINANCE:MATICUSDT",
    },
    Chainlink: {
        name: "Chainlink",
        symbol: "BINANCE:LINKUSDT",
    }
} as const

export type CryptoValue = typeof cryptos[keyof typeof cryptos]
export type CryptoKey = keyof typeof cryptos