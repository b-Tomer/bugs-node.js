import { bugService } from '../services/bug.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugList } from '../cmps/bug-list.jsx'
import { BugFilter } from '../cmps/bug-filter.jsx'
const { Link } = ReactRouterDOM
const { useState, useEffect } = React

export function BugIndex() {

    const [bugs, setBugs] = useState([])

    const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())
    const [sortBy, setSortBy] = useState('')
    const [pagesCount, setPagesCount] = useState('')
    const [lables, setLables] = useState({ critical: false, needCr: false, devBranch: false })


    useEffect(() => {
        loadBugs()
    }, [filterBy, sortBy, lables])


    function onSetFilter(filterBy) {
        setFilterBy((prevFilterBy) => ({ ...prevFilterBy, ...filterBy }))
    }

    function onSetSort(ev) {
        let userSortBy = ev.target.value
        setSortBy(userSortBy)
    }

    function loadBugs() {
        bugService.query(filterBy, sortBy, lables).then(res => {
            setPagesCount(res.pageCount)
            setBugs(res.bugs)
        })
    }

    function onRemoveBug(bugId) {
        bugService.remove(bugId)
            .then(() => {
                console.log('Deleted Succesfully!')
                const bugsToUpdate = bugs.filter(bug => bug._id !== bugId)
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug removed')
            })
            .catch(err => {
                console.log('Error from onRemoveBug ->', err)
                showErrorMsg('Cannot remove bug')
            })
    }

    function onAddBug() {
        const bug = {
            title: prompt('Bug title?'),
            severity: +prompt('Bug severity?'),
            description: prompt('Description?'),
            createdAt: Date.now(),
            labels: ["critical",
                "need-CR",
                "dev-branch"]       
        }
        bugService.save(bug)
            .then(savedBug => {
                console.log('Added Bug', savedBug)
                setBugs([...bugs, savedBug])
                showSuccessMsg('Bug added')
                loadBugs()
            })
            .catch(err => {
                console.log('Error from onAddBug ->', err)
                showErrorMsg('Cannot add bug')
            })
    }

    function onEditBug(bug) {
        const severity = +prompt('New severity?')
        const description = prompt('description: ')
        const bugToSave = { ...bug, severity, description }
        console.log(bugToSave);
        bugService.save(bugToSave)
            .then(savedBug => {
                console.log('Updated Bug:', savedBug.data)
                const bugsToUpdate = bugs.map(currBug => (currBug._id === savedBug._id) ? savedBug.data : currBug)
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug updated')
            })
            .catch(err => {
                console.log('Error from onEditBug ->', err)
                showErrorMsg('Cannot update bug')
            })
    }

    function onChangePageIdx(diff) {
        const nextPageIdx = filterBy.pageIdx + diff
        if (nextPageIdx >= pagesCount) return
        if (nextPageIdx < 0) return
        setFilterBy(prevFilterBy => ({ ...prevFilterBy, pageIdx: nextPageIdx }))
    }


    function onCheckBoxs(isLableChecked) {
        setLables(prevLables => ({ ...prevLables, ...isLableChecked }))
    }


    return (

        <main>
            <BugFilter onCheckBoxs={onCheckBoxs} onSetSort={onSetSort} onAddBug={onAddBug} onSetFilter={onSetFilter} filterBy={filterBy} />

            <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
            <section className='paging'>
                <button className='btn paging-txt' onClick={() => onChangePageIdx(-1)}>-</button>
                <span className='paging-txt'>{filterBy.pageIdx + 1}</span>
                <button className='btn paging-txt' onClick={() => onChangePageIdx(1)}>+</button>
            </section>
        </main>

    )


}
