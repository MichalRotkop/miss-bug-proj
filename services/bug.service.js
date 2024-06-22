import { utilService } from './util.service.js'

export const bugService = {
    query,
    getById,
    remove,
    save
}

var bugs = utilService.readJsonFile('./data/bug.json')
const PAGE_SIZE = 3

function query(filterBy) {
    var filteredBugs = bugs
    if (filterBy.title) {
        const regExp = new RegExp(filterBy.title, 'i')
        filteredBugs = filteredBugs.filter(bug => regExp.test(bug.title))
    }

    if (filterBy.minSeverity) {
        filteredBugs = filteredBugs.filter(bug => bug.severity >= filterBy.minSeverity)
    }

    if (filterBy.labels) {
        console.log('filterBy.labels', filterBy.labels)
        // const checkedLabels = []
        // for (labelName in filterBy.labels) {
        //     if (filterBy.labels[labelName] === true) checkedLabels.push(labelName)
        // }
        // console.log('checkedLabels',checkedLabels)

        // filteredBugs = filteredBugs.filter(bug => {
        //     return bug.labels.some(label => checkedLabels.includes(label))
        // })
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

function _saveBugsToFile() {
    return utilService.writeJsonFile('./data/bug.json', bugs)
}


