import { useState, useEffect } from "react"
import { ResponsiveLine } from "@nivo/line"
import { date } from "utils/date"
import { Stocks } from "utils/stocks"
import { intialData } from "utils/intialData"

import Title from "components/title/title"

type LineChartData = {
    x: string
    y: number | null
}

export default function LineChart({
    initalRange,
    rangePush,
    stock,
}: {
    initalRange?: [number, number]
    rangePush: number
    stock: Stocks
}) {
    const [data, setData] = useState<LineChartData[]>(intialData)
    const [range, setRange] = useState<[number | null, number | null]>(initalRange ?? [null, null])

    useEffect(() => {
        const ws = new WebSocket(`wss://ws.finnhub.io?token=${import.meta.env.VITE_API_KEY}`)

        ws.onopen = () => {
            console.log("connection started")
            if (ws.readyState === 1) {
                ws.send(JSON.stringify({ type: "subscribe", symbol: stock }))
            }
        }

        ws.onmessage = event => {
            let newJson = JSON.parse(event.data).data[0]
            const formattedTime = date.toMMSSCC(newJson.t)

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
                ws.send(JSON.stringify({ type: "unsubscribe", symbol: stock }))
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
            <Title text={stock}/>
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
                    legendOffset: -50,
                    legendPosition: "middle",
                }}
            />
        </div>
    )
}