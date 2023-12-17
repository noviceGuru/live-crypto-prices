import { useState, useEffect } from "react"
import { date } from "utils/date"
import { Stocks } from "utils/stocks"
import { intialData } from "utils/intialData"
import { Line } from "react-chartjs-2"
import { CategoryScale } from "chart.js"
import Chart from "chart.js/auto"

Chart.register(CategoryScale)

import Title from "components/title/title"

export default function LineChart({ stock }: { stock: Stocks }) {
    const [lineData, setLineData] = useState<number[]>(intialData.y)
    const [lineLabels, setLineLabels] = useState<string[]>(intialData.x)
    const [error, setError] = useState<boolean>()

    useEffect(() => {
        const ws = new WebSocket(`wss://ws.finnhub.io?token=${import.meta.env.VITE_API_KEY}`)

        ws.onopen = () => {
            console.log(`${stock} conection started`)
            if (ws.readyState === 1) {
                ws.send(JSON.stringify({ type: "subscribe", symbol: stock }))
            }
        }

        ws.onmessage = event => {
            let newJson = (JSON.parse(event.data) || {data: []}).data[0]
            const formattedTime = date.toMMSSCC(newJson.t)

            setLineData(prev => {
                let clonePrev = [...prev]
                clonePrev.shift()
                let next = clonePrev.concat(JSON.parse(newJson.p))
                return next
            })

            setLineLabels(prev => {
                let clonePrev = [...prev]
                clonePrev.shift()
                let next = clonePrev.concat(formattedTime)
                return next
            })
        }

        ws.onerror = () => setError(true)

        return () => {
            if (ws.readyState === 1) {
                ws.send(JSON.stringify({ type: "unsubscribe", symbol: stock }))
                setError(false)
            }
        }
    }, [])

    const lineD = {
        labels: lineLabels,
        datasets: [
            {
                label: stock,
                data: lineData,
                fill: false,
                borderColor: "rgba(75,192,192,1)",
                tension: 0.1,
            },
        ],
    }

    return (
        <div className="h-1/3 w-1/2 min-w-[14rem]">
            <Title text={stock} />
            {error ? <p className="text-center mt-20">Data is not provided from the server</p> : <Line data={lineD} />}
        </div>
    )
}
