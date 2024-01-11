import GitHubIconSVG from "assets/github_icon.svg"

export default function GitHubIcon() {
    return (
        <a
            href="https://github.com/noviceGuru/live-crypto-prices"
            target="_blank"
            className="absolute top-6 right-6 w-8 md:w-12"
        >
            <img src={GitHubIconSVG} alt="amin-arabi-github" />
        </a>
    )
}
