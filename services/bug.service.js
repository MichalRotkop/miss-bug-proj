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

function getById() {

}

function remove() {

}

function save() {

}


