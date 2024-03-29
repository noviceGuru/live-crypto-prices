import { useState, useEffect } from "react"
import { date } from "utils/date"
import { intialData } from "utils/intialData"
import { Line } from "react-chartjs-2"
import { CategoryScale } from "chart.js"
import { CryptoValue } from "utils/cryptos"
import Chart from "chart.js/auto"

import Title from "components/title/title"

Chart.register(CategoryScale)


export default function LineChart({ crypto }: { crypto: CryptoValue }) {
    const [lineData, setLineData] = useState<number[]>(intialData.y)
    const [lineLabels, setLineLabels] = useState<string[]>(intialData.x)
    const [error, setError] = useState<boolean>()

    useEffect(() => {
        setLineData(intialData.y)
        setLineLabels(intialData.x)
        const ws = new WebSocket(`wss://ws.finnhub.io?token=${import.meta.env.VITE_API_KEY}`)

        ws.onopen = () => {
            console.log(`${crypto.name} conection started`)
            if (ws.readyState === 1) {
                ws.send(JSON.stringify({ type: "subscribe", symbol: crypto.symbol }))
            }
        }

        ws.onmessage = event => {
            setError(false)
            let newJson = (JSON.parse(event.data) || { data: [] }).data[0]
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
                ws.send(JSON.stringify({ type: "unsubscribe", symbol: crypto.symbol }))
                setError(false)
            }
        }
    }, [crypto.name])

    const lineD = {
        labels: lineLabels,
        datasets: [
            {
                label: crypto.name + " to USD",
                data: lineData,
                fill: false,
            },
        ],
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                display: true,
                title: {
                    display: true,
                    text: "Minuts:Seconds:00",
                },
            },
            y: {
                display: true,
                grace: "10%",
                title: {
                    display: true,
                    text: "USD",
                },
            },
        },
    }

    return (
        <div className="flex flex-col items-center justify-around h-4/5 w-full">
                <Title text={crypto.name} />
                <div className="h-24 flex justify-center">
                    {!lineData[9] && (<p className="text-center">Waiting for the first point of data</p>)}
                </div>
            <div className="h-2/3 w-2/3 lg:h-2/3 lg:w-1/2 min-w-[14rem]">
                {error ? (
                    <p className="text-center mt-20">Data is not provided from the server</p>
                ) : (
                    <Line data={lineD} options={options}/>
                )}
            </div>
        </div>
    )
}
