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
    const { _id, title, severity, description } = req.query
    const bugToSave = {
        _id,
        title: title || 'undefined bug',
        severity: +severity || 0,
        description: description || ''
    }
    bugService.save(bugToSave)
        .then(savedBug => res.send(savedBug))
})

app.get('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    bugService.getById(bugId)
        .then(bug => res.send(bug))
})

app.get('/api/bug/:bugId/remove', (req, res) => {
    const { bugId } = req.params
    bugService.remove(bugId)
        .then(() => res.send(`Removed bug ${bugId}...`))
})

app.listen(3030, () => console.log('Server ready at port 3030'))