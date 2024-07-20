"use client"

import {useRouter} from "next/navigation"

const RunScraperButton = () => {


    const router = useRouter()

    const handleClick = () => {
        router.refresh();
        router.push(`/?runScraperButton=${true}`);
    }

    return (
        <div>
            <button onClick={handleClick}>Run scraper</button>
        </div>
    )
}

export default RunScraperButton;