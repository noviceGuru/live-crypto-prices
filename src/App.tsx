import { useState } from "react"

// Components
import LineChart from "components/line-chart/line-chart"
import GitHubIcon from "components/github-icon/github-icon"

// Utils
import { cryptos, CryptoKey } from "utils/cryptos"

export default function App() {
    const [selectedCrypto, setSelectedCrypto] = useState<CryptoKey>("Bitcoin")
    return (
        <div className="h-screen flex flex-col gap-12 flex-wrap justify-center items-center">
                <GitHubIcon/>
                <select onChange={e => setSelectedCrypto(e.target.value as CryptoKey)}>
                    {Object.keys(cryptos).map(el => <option value={el} key={el}>{el}</option>)}
                </select>
                <LineChart crypto={cryptos[selectedCrypto]} />
        </div>
    )
}
