

import { BugList } from "../cmps/bug-list.jsx";
import { bugService } from "../services/bug.service.js";
import { userService } from "../services/user.service.js";
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'

const { useState, useEffect } = React



export function UserDetails() {
    // {user ,bugs ,onRemoveBug}
    const [user,setUser] =useState(userService.getLoggedinUser()) 
    const [userBugs, setUserBugs] = useState([])

    useEffect(() => {
        loadBugs()
    }, [])


    function loadBugs() {
        bugService.query({ ownerId: user._id }).then(res => {
            // console.log(res);
            setUserBugs(res.bugs)
            
        })
    }


    function onRemoveBug(bugId) {
        bugService.remove(bugId)
            .then(() => {
                console.log('Deleted Succesfully!')
                console.log(bugId);
                const bugsToUpdate = userBugs.filter(bug => bug._id !== bugId)
                setUserBugs(bugsToUpdate)
                showSuccessMsg('Bug removed')
            })
            .catch(err => {
                console.log('Error from onRemoveBug ->', err)
                showErrorMsg('Cannot remove bug')
            })
    }
if(!userBugs.length) return <h1>LOADING...</h1>
    return (
        // <h1>helllo</h1>
        <section className="user-details txt-center">
            
            <h2>{user.fullname}</h2>
            <br />
            <h3>your bugs:</h3>
            <BugList bugs={userBugs} onRemoveBug={onRemoveBug}  />
        </section>
    )
}

