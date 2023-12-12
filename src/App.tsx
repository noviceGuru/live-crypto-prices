import { useEffect, useState } from "react"
import { ResponsiveLine } from "@nivo/line"

export default function App() {
    const [data, setData] = useState()

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
            setData(event.data)
            console.log(event.data)
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
            data: [
                { x: 1, y: 190 },
                { x: 3, y: 210 },
                { x: 8, y: 230 },
                { x: 4, y: 290 },
            ],
        },
    ]
    return (
        <div className="h-screen p-4">
            <ResponsiveLine
                data={chartData}
                margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                xScale={{ type: "point" }}
                yScale={{
                    type: "linear",
                    min: "auto",
                    max: "auto",
                    stacked: true,
                    reverse: false,
                }}
                yFormat=" >-.2f"
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: "transportation",
                    legendOffset: 36,
                    legendPosition: "middle",
                }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: "count",
                    legendOffset: -40,
                    legendPosition: "middle",
                }}
                pointSize={10}
                pointColor={{ theme: "background" }}
                pointBorderWidth={2}
                pointBorderColor={{ from: "serieColor" }}
                pointLabelYOffset={-12}
                useMesh
                legends={[
                    {
                        anchor: "bottom-right",
                        direction: "column",
                        justify: false,
                        translateX: 100,
                        translateY: 0,
                        itemsSpacing: 0,
                        itemDirection: "left-to-right",
                        itemWidth: 80,
                        itemHeight: 20,
                        itemOpacity: 0.75,
                        symbolSize: 12,
                        symbolShape: "circle",
                        symbolBorderColor: "rgba(0, 0, 0, .5)",
                        effects: [
                            {
                                on: "hover",
                                style: {
                                    itemBackground: "rgba(0, 0, 0, .03)",
                                    itemOpacity: 1,
                                },
                            },
                        ],
                    },
                ]}
            />
        </div>
    )
}
