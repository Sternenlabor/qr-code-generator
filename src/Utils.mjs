export default class Utils {
    static debounce(func, delay) {
        let debounceTimer
        return function (...args) {
            const context = this
            clearTimeout(debounceTimer)
            debounceTimer = setTimeout(() => func.apply(context, args), delay)
        }
    }

    static replaceCharacters(str, replacements) {
        return str.replace(new RegExp(Object.keys(replacements).join('|'), 'gi'), (match) => replacements[match])
    }

    static clearElement(element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild)
        }
    }

    static escapeHTML(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;')
    }
    
    static replace(d, r) {
        for (const k of Object.keys(r)) {
            d = d.replaceAll(k, r[k])
        }
        return d
    }

    static getFilename(type) {
        const dateTime = this.replace(new Date().toISOString().slice(0, 19), {
            ':': '',
            '-': '',
            T: '-'
        })
        switch (type) {
            case 'svg':
            case 'png':
                return `qrcode-${dateTime}.${type}`
            case 'pdf':
                return `qrcodes-${dateTime}.pdf`
        }
        return `${dateTime}.${type}`
    }

    static getCssValue(prop) {
        const cssColorFunction = getComputedStyle(document.documentElement).getPropertyValue(prop)
        return cssColorFunction
        //return ColorUtils.convertColor(cssColorFunction) //fuuuu Firefox
    }
}
