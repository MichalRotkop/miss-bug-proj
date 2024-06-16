import express from 'express'

import { bugService } from './services/bug.service.js'

const app = express()

app.get('/', (req, res) => {
    res.send('hello')
})

app.get('/api/bug', (req, res) => {
    bugService.query()
        .then(bugs => res.send(bugs))
})

app.get('/api/bug/save', (req, res) => {
})

app.get('/api/bug/:bugId', (req, res) => {
    console.log('req.params', req.params)
    const { bugId } = req.params
    bugService.getById(bugId)
        .then(bug => res.send(bug))
})

app.get('/api/bug/:bugId/remove', (req, res) => {
})

app.listen(3030, () => console.log('Server ready at port 3030'))