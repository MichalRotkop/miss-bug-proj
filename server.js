import express from 'express'
import cookieParser from 'cookie-parser'
import fs from 'fs'
import PDFDocument from 'pdfkit'

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
        pageIdx: +req.query.pageIdx || 0,
        sortBy: req.query.sortBy || '',
        sortDir: +req.query.sortDir || 1
    }
    bugService.query(filterBy)
        .then(bugs => res.send(bugs))
        .catch(err => {
            console.log('err:', err)
            loggerService.error(`Couldn't get bugs...`, err)
            res.status(500).send(`Couldn't get bugs...`)
        })
})

app.get('/api/bug/labels', (req, res) => {
    bugService.getLabels()
        .then(labels => res.send(labels))
        .catch(err => {
            console.log('err:', err)
            loggerService.error(`Couldn't get Labels...`, err)
            res.status(500).send(`Couldn't get Labels...`)
        })
})

app.get('/api/bug/pageCount', (req, res) => {
    bugService.getPageCount()
        .then(pageCount => res.send(pageCount + ''))
        .catch(err => {
            console.log('err:', err)
            loggerService.error(`Couldn't get pageCount...`, err)
            res.status(500).send(`Couldn't get pageCount...`)
        })
})

app.get('/api/bug/download', (req, res) => {
    const doc = new PDFDocument()
    doc.pipe(fs.createWriteStream('bugs.pdf'))
    doc.fontSize(25).text('BUGS LIST').fontSize(16)
    bugService.query()
        .then((bugs) => {
            bugs.forEach((bug) => {
                const bugTxt = `${bug.title}: ${bug.description}. (severity: ${bug.severity})`
                doc.text(bugTxt)
            })

            doc.end()
            res.end()
        })
})

app.put('/api/bug', (req, res) => {
    const { _id, title, severity, description } = req.body
    const bugToSave = {
        _id,
        title: title || '',
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
    const { title, severity, description, labels } = req.body
    const bugToSave = {
        title: title || '',
        severity: +severity || 0,
        description: description || '',
        labels: labels || []
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

// userRoute



const port = 3030
app.listen(port, () => loggerService.info(`Server ready at port ${port}`))