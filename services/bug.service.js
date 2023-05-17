const fs = require('fs');
var bugs = require('../data/bug.json');
const PAGE_SIZE = 3
const pagesCount = Math.floor(bugs.length / PAGE_SIZE) + 1

function query(filterBy = {}, sortBy = '', lables = {}) {

    let bugsToDisplay = bugs

    switch (sortBy) {
        case 'title':
            bugsToDisplay.sort((a, b) => {
                const nameA = a.title.toUpperCase()
                const nameB = b.title.toUpperCase()
                if (nameA < nameB) return -1
                if (nameA > nameB) return 1
                return 0
            })
            break;
        case 'careatedAt':
            bugsToDisplay.sort((a, b) => a.createdAt - b.createdAt)
            break;
        case 'severity':
            bugsToDisplay.sort((a, b) => a.severity - b.severity)
    }

    if (lables.critical) bugsToDisplay = bugsToDisplay.filter(bug => bug.labels.includes('critical'))
    if (lables.needCr) bugsToDisplay = bugsToDisplay.filter(bug => bug.labels.includes('need-CR'))
    if (lables.devBranch) bugsToDisplay = bugsToDisplay.filter(bug => bug.labels.includes('dev-branch'))

    if (filterBy.title) {
        const regExp = new RegExp(filterBy.title, 'i')
        bugsToDisplay = bugsToDisplay.filter(bug => regExp.test(bug.title))
    }


    if (filterBy.severity) {
        bugsToDisplay = bugsToDisplay.filter(bug => bug.severity >= filterBy.severity)
    }

    if (filterBy.pageIdx !== undefined) {
        let startIdx = filterBy.pageIdx * PAGE_SIZE
        bugsToDisplay = bugsToDisplay.slice(startIdx, startIdx + PAGE_SIZE)
    }

    if (filterBy.ownerId) {
        bugsToDisplay = bugsToDisplay.filter(bug => bug.creator._id === filterBy.ownerId)
        console.log('bugsToDisplay: ', bugsToDisplay)
    }

    return Promise.resolve({ bugs: bugsToDisplay, pageCount: pagesCount })
}

function get(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    if (!bug) return Promise.reject('bug not found!')
    return Promise.resolve(bug)
}

function remove(bugId, loggedinUser) {
    const bugToUpdate = bugs.find(currbug => currbug._id === bugId)
    if (bugToUpdate.creator._id === loggedinUser._id || loggedinUser.isAdmin){
        console.log('bugToUpdate.creator._id: ', bugToUpdate.creator._id )
        console.log('loggedinUser._id: ', loggedinUser._id )
        console.log('loggedinUser.isAdmin: ', loggedinUser.isAdmin )
        bugs = bugs.filter(bug => bug._id !== bugId)
        return _savebugsToFile()
    }else return Promise.reject('Not your bug')
    
    // return Promise.resolve('bug removed')
}

function save(bug, loggedinUser) {
    if (bug._id) {
        const bugToUpdate = bugs.find(currbug => currbug._id === bug._id)
        if (bugToUpdate.creator._id === loggedinUser._id || loggedinUser.isAdmin) {
            bugToUpdate.title = bug.title
            bugToUpdate.severity = bug.severity
            bugToUpdate.description = bug.description
        } else return Promise.reject('Not your bug')
    } else {
        bug._id = _makeId()
        bug.creator = loggedinUser
        bugs.push(bug)
    }

    return _savebugsToFile().then(() => bug)
    // return Promise.resolve(bug)
}

function _makeId(length = 5) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

function _savebugsToFile() {
    return new Promise((resolve, reject) => {

        const bugsStr = JSON.stringify(bugs, null, 2)
        fs.writeFile('data/bug.json', bugsStr, (err) => {
            if (err) {
                return console.log(err);
            }
            console.log('The file was saved!');
            resolve()
        });
    })
}

// function getPages() {
//     console.log('pagesCount: ', pagesCount)
//     return Promise.resolve(pagesCount)
// }

module.exports = {
    query,
    get,
    remove,
    save,
    // getPages
}