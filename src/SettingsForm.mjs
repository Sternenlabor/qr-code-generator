import UrlHandler from './UrlHandler.mjs'
import Utils from './Utils.mjs'

const template = document.createElement('template')
template.innerHTML = /* html */ `
        <style> @import url("/src/SettingsForm.css"); </style>

        <h3 id="settings-title">QR Code Settings</h3>

        <div class="form-group group-1" id="color-set">
            <label for="color-select">Farbe</label>

            <input id="color-select" type="color" value="#ff0000" list="predefined" />
            <datalist id="predefined">
                <option>#ff0000</option>
                <option>#fff000</option>
                <option>#00ff00</option>
            </datalist>
        </div>

        <div class="form-group group-2" id="url-set">
            <label for="url">Wiki URL</label>
            <textarea id="url" rows="4"></textarea>
        </div>
        
        <div class="form-group group-3">
            <label for="size">QR Code Height:</label>
            <select name="size" id="size">
                <option value="15">15 mm</option>
                <option value="25" selected>25 mm</option>
                <option value="40">40 mm</option>
                <option value="80">80 mm</option>
            </select>
        </div>`

class SettingsForm extends HTMLElement {
    url = ''
    color = 'black'
    size = 25
    optimizeForPrint = false

    #root = null

    constructor() {
        super()
        this.attachShadow({ mode: 'open' })
        this.shadowRoot.append(template.content.cloneNode(true))

        this.#root = this.shadowRoot.getRootNode()

        this.url = this.getAttribute('url') || ''
        this.color = this.getAttribute('color') || 'black'
        this.size = parseFloat(this.getAttribute('size') || 25)

        const urlInput = this.#root.getElementById('url')
        const colorSelect = this.#root.getElementById('color-select')
        const size = this.#root.getElementById('size')

        urlInput.textContent = this.url

        urlInput.addEventListener('keyup', Utils.debounce(this.#handleInputChange.bind(this), 300), {
            passive: false
        })

        colorSelect.addEventListener('change', this.#handleColorSelectChange.bind(this), {
            passive: false
        })

        size.addEventListener('change', this.#handleSelectChange.bind(this), {
            passive: false
        })

        setTimeout(() => urlInput.focus(), 0)
    }

    static get observedAttributes() {
        return ['url', 'color', 'size']
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (newValue != oldValue) {
            switch (name) {
                case 'url':
                    this[name] = newValue
                    break
                case 'color':
                    this[name] = newValue
                    break
                case 'size':
                    this[name] = parseFloat(newValue)
                    break
            }
        }
    }

    storeCurrentValue(val) {
        this.url = val
    }

    hasValueChanged(val) {
        return this.url !== val
    }

    async #handleInputChange(e) {
        e.stopPropagation()
        const val = this.#root.getElementById('url').value

        if (!this.hasValueChanged(val)) return

        if (await UrlHandler.isValidUrl(val)) {
            this.storeCurrentValue(val)

            this.dispatchEvent(
                new CustomEvent('change', {
                    detail: {
                        url: this.url,
                        color: this.color,
                        size: this.size
                    },
                    composed: true
                })
            )
        } else {
            console.error('Invalid URL or URL does not return status 200')
        }
    }

    #handleColorSelectChange(e) {
        e.stopPropagation()
        this.color = e.target.value

        this.dispatchEvent(
            new CustomEvent('change', {
                detail: {
                    url: this.url,
                    color: this.color,
                    size: this.size
                },
                composed: true
            })
        )
    }

    #handleSelectChange(e) {
        e.stopPropagation()
        const val = e.target.value
        this.size = parseInt(val, 10)

        this.dispatchEvent(
            new CustomEvent('change', {
                detail: {
                    url: this.url,
                    color: this.color,
                    size: this.size
                },
                composed: true
            })
        )
    }
}

customElements.define('settings-form', SettingsForm)
