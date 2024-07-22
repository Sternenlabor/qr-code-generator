const express = require('express')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 3000

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '/')))

// Redirect to test.html for the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/', 'test.html'))
})

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
