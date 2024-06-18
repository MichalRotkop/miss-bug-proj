export const bugService = {
    query,
    getById,
    save,
    remove,
    getDefaultFilter,
}

const BASE_URL = '/api/bug'

function query(filterBy) {
    return axios.get(BASE_URL)
        .then(res => res.data)
        .then(bugs => {
            if (filterBy.title) {
                const regExp = new RegExp(filterBy.title, 'i')
                bugs = bugs.filter(bug => regExp.test(bug.title))
            }

            if (filterBy.minSeverity) {
                bugs = bugs.filter(bug => bug.severity >= filterBy.minSeverity)
            }
            return bugs
        })
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