export default class UrlHandler {
    static async isValidUrl(url) {
        try {
            const response = await fetch(`cors-proxy.php?url=${encodeURIComponent(url)}`)
            if (!response.ok) {
                return false
            }
            const text = await response.text()
            return !text.includes('Dieses Thema existiert noch nicht')
        } catch (error) {
            return false
        }
    }

    static async fetchShortenedUrlWithRetry(url, retries = 5, delay = 1000) {
        const apiUrl = `https://s.sternenlabor.de/public-api.php?action=shorturl&format=json&url=${encodeURIComponent(url)}`
        let attempt = 0

        while (attempt < retries) {
            try {
                const response = await fetch(`cors-proxy.php?url=${encodeURIComponent(apiUrl)}`)
                if (response.status === 429) {
                    throw new Error('Too Many Requests')
                } else if (!response.ok && response.status !== 400) {
                    throw new Error('Failed to fetch shortened URL')
                }
                const data = await response.json()
                if (data && data.shorturl) {
                    return data.shorturl
                } else {
                    throw new Error('Shortening URL failed')
                }
            } catch (error) {
                attempt++
                if (attempt >= retries) {
                    console.error(error)
                    return url
                }
                await new Promise((res) => setTimeout(res, delay))
                delay *= 2 // Exponential backoff
            }
        }
    }
}
