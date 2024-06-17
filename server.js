import express from 'express'

import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'

const app = express()

app.use(express.static('public'))

app.get('/api/bug', (req, res) => {
    bugService.query()
        .then(bugs => res.send(bugs))
        .catch(err => {
            loggerService.error(`Couldn't get bugs...`, err)
            res.status(500).send(`Couldn't get bugs...`)
        })
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
        .catch(err => {
            loggerService.error(`Couldn't save bug...`, err)
            res.status(500).send(`Couldn't save bug...`)
        })
})

app.get('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    bugService.getById(bugId)
        .then(bug => res.send(bug))
        .catch(err => {
            loggerService.error(`Couldn't get bug...`, err)
            res.status(500).send(`Couldn't get bug...`)
        })
})

app.get('/api/bug/:bugId/remove', (req, res) => {
    const { bugId } = req.params
    bugService.remove(bugId)
        .then(() => res.send(`Removed bug ${bugId}...`))
        .catch(err => {
            loggerService.error(`Couldn't remove bug...`, err)
            res.status(500).send(`Couldn't remove bug...`)
        })
})

const port = 3030
app.listen(port, () => loggerService.info(`Server ready at port ${port}`))