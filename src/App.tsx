import { Stocks } from "utils/stocks"
import LineChart from "./components/line-chart/line-chart"

export default function App() {
    return <LineChart rangePush={5} stock={Stocks.Bitcoin} />
}
