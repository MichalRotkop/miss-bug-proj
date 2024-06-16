import { utilService } from './util.service.js'

export const bugService = {
    query,
    getById,
    remove,
    save
}

var bugs = utilService.readJsonFile('./data/bug.json')

function query() {
    return Promise.resolve(bugs)
}

function getById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    return Promise.resolve(bug)
}

function remove() {

}

function save() {

}


