import express from 'express'
import cookieParser from 'cookie-parser'

import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'

const app = express()

app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())


app.get('/api/bug/', (req, res) => {
    const filterBy = {
        title: req.query.title || '',
        minSeverity: +req.query.minSeverity || 0,
        labels: req.query.labels || [],
        pageIdx: req.query.pageIdx || 0,
        sortBy: req.query.sortBy || {}
    }
    console.log('filterBy', filterBy)

    bugService.query(filterBy)
        .then(bugs => res.send(bugs))
        .catch(err => {
            loggerService.error(`Couldn't get bugs...`, err)
            res.status(500).send(`Couldn't get bugs...`)
        })
})

app.put('/api/bug/:bugId', (req, res) => {
    const { _id, title, severity, description } = req.body
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

app.post('/api/bug/', (req, res) => {
    const {title, severity, description } = req.body
    const bugToSave = {
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

    const visitedBugs = req.cookies.visitedBugs || []
    const visitedBug = visitedBugs.some(bug => bug._id === bugId)

    if (visitedBugs.length === 3 && !visitedBug) {
        return res.status(401).send('Wait for a bit')
    } else {
        bugService.getById(bugId)
            .then(bug => {
                if (!visitedBug) {
                    visitedBugs.push(bug)
                    res.cookie('visitedBugs', visitedBugs, { maxAge: 7000 })
                }
                res.send(bug)

                console.log('User visited at the following bugs:', visitedBugs)
            })
            .catch(err => {
                loggerService.error(`Couldn't get bug...`, err)
                res.status(500).send(`Couldn't get bug...`)
            })
    }
})

app.delete('/api/bug/:bugId', (req, res) => {
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