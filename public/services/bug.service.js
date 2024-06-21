export const bugService = {
    query,
    getById,
    save,
    remove,
    getDefaultFilter,
}

const BASE_URL = '/api/bug'

function query(filterBy = {}) {
    return axios.get(BASE_URL, {params: filterBy})
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

function getDefaultFilter() {
    return { title: '', minSeverity: '' }
}