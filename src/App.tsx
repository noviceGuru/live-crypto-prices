import { useEffect, useState } from "react"
import { ResponsiveLine } from "@nivo/line"

type LineChartData = {
    x: string
    y: number | null
}

export default function App() {
    let arr = []
    for (let i = 0; i < 10; i++) {
        arr.push({ x: `${i}`, y: null })
    }

    let rangePush = 5

    const [data, setData] = useState<LineChartData[]>(arr)
    const [range, setRange] = useState<[number | null, number | null]>([null, null])

    useEffect(() => {
        const ws = new WebSocket(`wss://ws.finnhub.io?token=${import.meta.env.VITE_API_KEY}`)

        ws.onopen = () => {
            console.log("connection started")
            if (ws.readyState === 1) {
                // ws.send(JSON.stringify({ type: "subscribe", symbol: "AAPL" }))
                ws.send(JSON.stringify({ type: "subscribe", symbol: "BINANCE:BTCUSDT" }))
                // ws.send(JSON.stringify({ type: "subscribe", symbol: "IC MARKETS:1" }))
                // ws.send(JSON.stringify({ type: "subscribe", symbol: "AMZN" }))
            }
        }

        ws.onmessage = event => {
            // console.log(JSON.parse(event.data), "pure innocent data")
            let newJson = JSON.parse(event.data).data[0]
            let newTime = new Date(newJson.t)

            const minutes = newTime.getUTCMinutes()
            const seconds = newTime.getUTCSeconds()
            const centiseconds = Math.round(newTime.getUTCMilliseconds() / 10)

            // Use string interpolation to format the result as mm:ss
            const formattedTime = `${minutes.toString().padStart(2, "0")}
                :${seconds.toString().padStart(2, "0")}
                .${centiseconds.toString().padStart(2, '0')}`

            const newEntry: LineChartData = {
                x: formattedTime,
                y: JSON.parse(event.data).data[0].p,
            }

            // INITIALIZATION
            if (!range[0]) {
                setRange([(newEntry.y || rangePush) - rangePush, (newEntry.y || 0) + rangePush])
            }

            // CHECK LOWER LIMIT OF THE RANGE
            if ((range[0] as number) > newEntry.y!) {
                setRange(range => [newEntry.y! - rangePush, range[1]])
            }

            // CHECK UPPER LIMIT OF THE RANGE
            if ((range[0] as number) < newEntry.y!) {
                setRange(range => [range[0], newEntry.y! + rangePush])
            }

            setData(oldEntry => {
                let oldEntryClone = structuredClone(oldEntry)

                oldEntryClone.shift()
                let newState = oldEntryClone.concat(newEntry)
                return newState
            })
        }

        return () => {
            if (ws.readyState === 1) {
                ws.send(JSON.stringify({ type: "unsubscribe", symbol: "AAPL" }))
                ws.send(JSON.stringify({ type: "unsubscribe", symbol: "BINANCE:BTCUSDT" }))
                ws.send(JSON.stringify({ type: "unsubscribe", symbol: "IC MARKETS:1" }))
                ws.send(JSON.stringify({ type: "unsubscribe", symbol: "AMZN" }))
            }
        }
    }, [])

    const chartData = [
        {
            id: "Amazon",
            color: "hsl(113, 70%, 50%)",
            data: data,
        },
    ]

        return (
        <div className="h-screen p-4">
            <ResponsiveLine
                data={chartData}
                margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                yScale={{
                    type: "linear",
                    min: range[0] ?? 0,
                    max: range[1] ?? rangePush,
                }}
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: "Time",
                    legendOffset: 36,
                    legendPosition: "middle",
                }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: "Price $",
                    legendOffset: -40,
                    legendPosition: "middle",
                }}
            />
        </div>
    )
}
