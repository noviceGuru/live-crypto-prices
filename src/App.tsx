import { useEffect, useState } from "react"

export default function App() {
    const [data, setData] = useState()

    useEffect(() => {
        const ws = new WebSocket(`wss://ws.finnhub.io?token=${import.meta.env.VITE_API_KEY}`)

        ws.onopen = () => {
            console.log("connection started")
            ws.send(JSON.stringify({'type':'subscribe', 'symbol': 'AAPL'}))
            ws.send(JSON.stringify({'type':'subscribe', 'symbol': 'BINANCE:BTCUSDT'}))
            ws.send(JSON.stringify({'type':'subscribe', 'symbol': 'IC MARKETS:1'}))
        }

        ws.onmessage = event => {
            setData(event.data)
            console.log(event.data)
        }

        return  () => {
            ws.send(JSON.stringify({'type':'unsubscribe','symbol': 'AAPL'}))
            ws.send(JSON.stringify({'type':'unsubscribe','symbol': 'BINANCE:BTCUSDT'}))
            ws.send(JSON.stringify({'type':'unsubscribe','symbol': 'IC MARKETS:1'}))
        }
    }, [])

    return <p className="bg-red-500">Live Stats : {data}</p>
}
