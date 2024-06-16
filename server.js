import express from 'express'

const app = express()

app.get('/', (req, res) => {
    res.send('hello')
})

app.get('/api/bug', (req, res) => {
})

app.get('/api/bug/save', (req, res) => {
})

app.get('/api/bug/:bugId', (req, res) => {
})

app.get('/api/bug/:bugId/remove', (req, res) => {
})


app.listen(3030, () => console.log('Server ready at port 3030'))