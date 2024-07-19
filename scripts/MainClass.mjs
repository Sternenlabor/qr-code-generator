import QRCodeGenerator from './QRCodeGenerator.mjs'
import UrlHandler from './UrlHandler.mjs'
import Utils from './Utils.mjs'

export default class MainClass {
    shortUrl = ''
    container
    urlInput
    downloadButton
    colorInput

    constructor(containerId, urlInputId, downloadButton, colorInputId) {
        this.container = document.getElementById(containerId)
        this.urlInput = document.getElementById(urlInputId)
        this.downloadButton = document.getElementById(downloadButton)
        this.colorInput = document.getElementById(colorInputId)

        this.urlInput.value = 'https://wiki.sternenlabor.de/doku.php?id=bereiche:elektronik:geraete:oszilloskop_ut2042c'

        this.container.updateQRCode = this.updateQRCode.bind(this)

        this.downloadButton.onclick = () => this.downloadQRCode(this.container.innerHTML)

        this.initialize()

        this.urlInput.focus()

        this.colorInput.onchange = () => this.container.updateQRCode()
        this.urlInput.onkeyup = Utils.debounce(this.handleKeyUp.bind(this), 300)
    }

    async initialize() {
        if (await UrlHandler.isValidUrl(this.urlInput.value)) {
            this.shortUrl = await UrlHandler.fetchShortenedUrlWithRetry(this.urlInput.value)
            this.container.updateQRCode()
            this.storeCurrentValue(this.urlInput)
        } else {
            console.error('Invalid URL or URL does not return status 200')
        }
    }

    storeCurrentValue(element) {
        element._value = element.value
    }

    hasValueChanged(element) {
        return element._value !== element.value
    }

    downloadQRCode(svgData) {
        svgData = svgData.replace('width="256"', 'width="120"')
        svgData = svgData.replace('height="256"', 'height="120"')

        const filename =
            'qrcode-' +
            Utils.replaceCharacters(new Date().toISOString().slice(0, 19), {
                ':': '',
                '-': '',
                T: '-'
            }) +
            '.svg'

        const blob = new Blob([svgData], { type: 'image/svg+xml' })

        if (window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, filename)
        } else {
            const link = document.createElement('a')
            const url = URL.createObjectURL(blob)

            link.href = url
            link.download = filename

            document.body.appendChild(link)
            link.click()

            setTimeout(() => {
                document.body.removeChild(link)
                window.URL.revokeObjectURL(url)
            }, 0)
        }

        return false
    }

    async handleKeyUp() {
        if (!this.hasValueChanged(this.urlInput)) return

        if (await UrlHandler.isValidUrl(this.urlInput.value)) {
            this.shortUrl = await UrlHandler.fetchShortenedUrlWithRetry(this.urlInput.value)
            this.container.updateQRCode()
            this.storeCurrentValue(this.urlInput)
        } else {
            console.error('Invalid URL or URL does not return status 200')
        }
    }

    updateQRCode() {
        const startTime = new Date()
        Utils.clearElement(this.container)

        const qrCodeData = {
            msg: this.shortUrl,
            dim: 120,
            pad: 4,
            mtx: -1,
            ecl: this.shortUrl.length > 60 ? 'Q' : 'H',
            ecb: true,
            pal: ['black', 'white'],
            vrb: true
        }

        const svg = QRCodeGenerator.generateCompleteQRCode(qrCodeData, this.colorInput.value)

        this.container.innerHTML = svg

        console.log(`QRCode generation time: ${new Date() - startTime} ms`)
    }
}
