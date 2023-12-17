import { useState } from "react"
import { Stocks } from "utils/stocks"
import LineChart from "./components/line-chart/line-chart"

export default function App() {
    const [stocks] = useState<Stocks[]>([Stocks.Amazon, Stocks.Bitcoin, Stocks.Forex, Stocks.Apple])
    return (
        <div className="h-screen flex flex-wrap justify-center bg-slate-400">
            {stocks.map(stock => (
                <LineChart stock={stock} key={stock}/>
            ))}
            <LineChart stock={Stocks.Bitcoin} key={'special'}/>
        </div>
    )
}
