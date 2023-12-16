import { Stocks } from "utils/stocks"
import LineChart from "./components/line-chart/line-chart"

export default function App() {
    return (
        <div>
            <LineChart rangePush={5} stock={Stocks.Bitcoin} />
            <LineChart rangePush={5} stock={Stocks.Forex} />
            <LineChart rangePush={5} stock={Stocks.Apple} />
            <LineChart rangePush={5} stock={Stocks.Amazon} />
        </div>
    )
}
