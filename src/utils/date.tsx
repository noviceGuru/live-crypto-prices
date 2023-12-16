export const date = {
    toMMSSCC: (unixMilisecs: number) => {
        let newTime = new Date(unixMilisecs)

        const minutes = newTime.getUTCMinutes()
        const seconds = newTime.getUTCSeconds()
        const centiseconds = Math.round(newTime.getUTCMilliseconds() / 10)

        // Use string interpolation to format the result as mm:ss
        const formattedTime =
            `${minutes.toString().padStart(2, "0")}` +
            `:${seconds.toString().padStart(2, "0")}` +
            `.${centiseconds.toString().padStart(2, "0")}`

        return formattedTime
    }
}
