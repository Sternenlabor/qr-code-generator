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
}
