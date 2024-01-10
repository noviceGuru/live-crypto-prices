import { useState } from "react"
import { cryptos, CryptoKey } from "utils/cryptos"
import LineChart from "./components/line-chart/line-chart"

export default function App() {
    const [selectedCrypto, setSelectedCrypto] = useState<CryptoKey>("Bitcoin")
    return (
        <div className="h-screen flex flex-col gap-12 flex-wrap justify-center items-center">
                <select onChange={e => setSelectedCrypto(e.target.value as CryptoKey)}>
                    {Object.keys(cryptos).map(el => <option value={el} key={el}>{el}</option>)}
                </select>
                <LineChart crypto={cryptos[selectedCrypto]} />
        </div>
    )
}
