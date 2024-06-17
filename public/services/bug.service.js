
import { utilService } from './util.service.js'

export const bugService = {
    query,
    getById,
    save,
    remove,
}

const BASE_URL = '/api/bug'

function query() {
    return axios.get(BASE_URL)
        .then(res => res.data)
}

function getById(bugId) {
    return axios.get(BASE_URL + `/${bugId}`)
        .then(res => res.data)
}

function remove(bugId) {
    return axios.get(BASE_URL + `/${bugId}/remove`)
}

function save(bug) {
    return axios.get(BASE_URL + `/save?_id=${bug._id || ''}&title=${bug.title}&severity=${bug.severity}&description=${bug.description}`)
        .then(res => res.data)
}