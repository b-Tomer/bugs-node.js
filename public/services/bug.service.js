import { utilService } from './util.service.js'
import { storageService } from './async-storage.service.js'

const BASE_URL = '/api/bug/'


export const bugService = {
    query,
    get,
    remove,
    save,
    getEmptybug,
    getDefaultFilter,
    getPagesCount
}
// &ownerId=${filterBy.ownerId || ''}

function query(filterBy = {}, sortBy ,lables) {
  
    let filterQueryParams
    if(filterBy.ownerId) filterQueryParams = `?ownerId=${filterBy.ownerId}`
    
    else filterQueryParams = `?title=${filterBy.title}&severity=${filterBy.severity}&lable=${filterBy.lable}&pageIdx=${filterBy.pageIdx}&sortBy=${sortBy}
    &lables=${JSON.stringify(lables)}`
    
    
    return axios.get(BASE_URL + filterQueryParams)
        .then(res => res.data)
}

function get(bugId) {
    // return storageService.get(BASE_URL, bugId)
    return axios.get(BASE_URL + bugId).then(res => res.data)
}

function remove(bugId) {
    return axios.delete(BASE_URL + bugId).then(res => res.data)
}

function save(bug) {
    console.log('bug: ', bug )
    const method = bug._id ? 'put' : 'post'
    return axios[method](BASE_URL , bug)
}

function getEmptybug(title = '', severity = '') {
    return { vendor, speed }
}

function getDefaultFilter() {
    return { title: '', severity: '', pageIdx: 0, lable: null }
}

function getPagesCount() {
    return axios.get(BASE_URL + 'page')
        .then(res => console.log(res.data))
}