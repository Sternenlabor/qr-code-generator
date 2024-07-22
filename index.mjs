import UrlHandler from '/src/UrlHandler.mjs'
import SVGRenderer from '/src/SVGRenderer.mjs'
import PNGRenderer from '/src/PNGRenderer.mjs'
//import PDFRenderer from '/src/PDFRenderer.mjs'

const box = document.querySelector('preview-box')
const form = document.querySelector('settings-form')

form.addEventListener('change', (e) => {
    box.setAttribute('value', e.detail.url)
    box.setAttribute('color', e.detail.color)
    box.setAttribute('size', e.detail.size)
    box.update()
})

box.setAttribute('value', form.url)
box.setAttribute('color', form.color)
box.setAttribute('size', form.size)
box.update()

document.querySelector('#download-svg').addEventListener('click', async () => {
    const shortUrl = await UrlHandler.fetchShortenedUrlWithRetry(form.url)
    SVGRenderer.downloadSVG(shortUrl, form.color, form.size)
})

document.querySelector('#download-png').addEventListener('click', async () => {
    const shortUrl = await UrlHandler.fetchShortenedUrlWithRetry(form.url)
    PNGRenderer.downloadPNG(shortUrl, form.color, form.size)
})
