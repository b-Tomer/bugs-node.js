const express = require('express')
const app = express()
const bugService = require('./services/bug.service')
const userService = require('./services/user.service')
const cookieParser = require('cookie-parser')


// app.get('/', (req, res) => res.send('Hello!'))
app.listen(3030, () => console.log('Server ready at port 3030!'))
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json()) // for req.body

// List

app.get('/api/bug', (req, res) => {

    let { title, severity, pageIdx, sortBy, lables, ownerId } = req.query
    const filterBy = { title, severity, pageIdx, ownerId }
    if (lables) lables = JSON.parse(lables)
    bugService.query(filterBy, sortBy, lables).then(bugs => {
        res.send(bugs)
    })
})

// Add
app.post('/api/bug', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot add car')

    const { title, severity, description, createdAt, labels } = req.body
    const bug = {
        title,
        severity: +severity,
        description,
        createdAt,
        labels,
        creator: loggedinUser
    }
    bugService.save(bug, loggedinUser)
        .then((savedBug) => {
            res.send(savedBug)
        })
        .catch(err => {
            console.log('Cannot add bug')
            res.status(400).send('Cannot add bug')
        })


})

// Edit
app.put('/api/bug/', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot update car')
    console.log('req.body: ', req.body)
    const { title, severity, _id, description, createdAt, labels } = req.body
    const bug = {
        _id,
        title,
        severity: +severity,
        description,
        createdAt,
        labels,
        creator: loggedinUser
    }
    bugService.save(bug, loggedinUser)
        .then((savedBug) => {
            res.send(savedBug)
        })
        .catch(err => {
            console.log('Cannot update bug')
            res.status(400).send('Cannot update bug')
        })

})

app.get('/api/bug/:bugId', (req, res) => {

    const { bugId } = req.params
    let visitedBugsIds = req.cookies.visitedBugsIds || []
    if (!visitedBugsIds.includes(bugId)) visitedBugsIds.push(bugId)
    if (visitedBugsIds.length > 2) return res.status(401).send('Wait for a bit')
    res.cookie('visitedBugsIds', visitedBugsIds, { maxAge: 1000 * 7 })

    bugService.get(bugId)
        .then(bug => res.send(bug))
        .catch(err => res.status(403).send(err))

})


// Remove
app.delete('/api/bug/:bugId/', (req, res) => {

    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot delete car')

    const { bugId } = req.params
    bugService.remove(bugId, loggedinUser)
        .then(msg => {
            res.send({ msg, bugId })
        })
        .catch(err => {
            console.log('Cannot remove bug')
            res.status(400).send('Cannot remove bug')
        })
})



//************ USER ************\\

// List
app.get('/api/user', (req, res) => {
    userService.query().then(user => {
        // console.log('user: ', user )
        res.send(user)
    })
})

app.post('/api/auth/login', (req, res) => {
    const credentials = req.body
    userService.checkLogin(credentials)
        .then(user => {
            const token = userService.getLoginToken(user)
            res.cookie('loginToken', token)
            res.send(user)
        })
        .catch(err => {
            res.status(401).send('Not you!')
        })
})

app.post('/api/auth/signup', (req, res) => {
    const credentials = req.body
    userService.save(credentials)
        .then(user => {
            const token = userService.getLoginToken(user)
            res.cookie('loginToken', token)
            res.send(user)
        })
        .catch(err => {
            console.log(err)
            res.status(401).send('Nope!')
        })
})

app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('logged-out!')
})


