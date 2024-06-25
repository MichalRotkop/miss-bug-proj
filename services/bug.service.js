import { utilService } from './util.service.js'

export const bugService = {
    query,
    getById,
    remove,
    save,
    getLabels,
    getPageCount
}

var bugs = utilService.readJsonFile('./data/bug.json')
const PAGE_SIZE = 3

function query(filterBy) {
    var filteredBugs = bugs
    if (!filterBy) return Promise.resolve(filteredBugs)
    if (filterBy.title) {
        const regExp = new RegExp(filterBy.title, 'i')
        filteredBugs = filteredBugs.filter(bug => regExp.test(bug.title))
    }

    if (filterBy.minSeverity) {
        filteredBugs = filteredBugs.filter(bug => bug.severity >= filterBy.minSeverity)
    }

    if (filterBy.labels && filterBy.labels.length > 0) { // (filterBy.labels?.length) 
        filteredBugs = filteredBugs.filter(bug => {
            return filterBy.labels.every(label => bug.labels.includes(label))
        })
    }

    if (filterBy.sortBy) {
        switch (filterBy.sortBy) {
            case 'title':
                filteredBugs = filteredBugs.sort((bugA, bugB) => bugA.title.localeCompare(bugB.title) * filterBy.sortDir)
                break;
            case 'severity':
                filteredBugs = filteredBugs.sort((bugA, bugB) => (bugA.severity - bugB.severity) * filterBy.sortDir)
                break;
            case 'createdAt':
                filteredBugs = filteredBugs.sort((bugA, bugB) => (bugA.createdAt - bugB.createdAt) * filterBy.sortDir)
                break;
        }
    }

    const startIdx = filterBy.pageIdx * PAGE_SIZE
    filteredBugs = filteredBugs.slice(startIdx, startIdx + PAGE_SIZE)

    return Promise.resolve(filteredBugs)
}

function getById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    return Promise.resolve(bug)
}

function remove(bugId) {
    const idx = bugs.findIndex(bug => bug._id === bugId)
    bugs.splice(idx, 1)
    return _saveBugsToFile()
}

function save(bugToSave) {
    bugToSave.createdAt = Date.now()
    if (bugToSave._id) {
        const idx = bugs.findIndex(bug => bug._id === bugToSave._id)
        bugs.splice(idx, 1, bugToSave)
    } else {
        bugToSave._id = utilService.makeId()
        bugs.push(bugToSave)
    }
    return _saveBugsToFile()
        .then(() => bugToSave)
}

function getLabels() {
    return query().then(bugs => {
        const bugLabels = bugs.reduce((acc, bug) => {
            return [...acc, ...bug.labels]
        }, [])
        return [...new Set(bugLabels)]
    })
}

function getPageCount() {
    return query()
        .then(bugs => Math.ceil(bugs.length / PAGE_SIZE))
}

function _saveBugsToFile() {
    return utilService.writeJsonFile('./data/bug.json', bugs)
}


