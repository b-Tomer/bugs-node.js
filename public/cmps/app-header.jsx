const { NavLink } = ReactRouterDOM
const { useEffect, useState } = React

import { userService } from '../services/user.service.js'
import { LoginSignup } from './login-signup.jsx'
import { UserMsg } from './user-msg.jsx'

export function AppHeader() {

    const [user, setUser] = useState(userService.getLoggedinUser())

    useEffect(() => {
        // component did mount when dependancy array is empty
    }, [])

    function onLogout() {
        userService
            .logout()
            .then(() => { setUser(null) })
    }

    function onChangeLoginStatus(user) {
        console.log('from header: ', user);
        setUser(user)
    }



    return (
        <header className='full' >
            <h1>Bugs</h1>
            <UserMsg />


            {user ? (
                < section className='txt-center' >
                    <h2>Hello {user.fullname}</h2>
                    <button className=' log-btn btn' onClick={onLogout}>Logout</button>
                </ section >
            ) : (
                <section className='login-container'>
                    <LoginSignup onChangeLoginStatus={onChangeLoginStatus} />
                </section>
            )}
            <nav className='main-nav'>
               {user && <NavLink to="/user" className=''>Profile</NavLink>}
                <NavLink to="/">Home</NavLink> |
                <NavLink to="/bug">Bugs</NavLink> |
                <NavLink to="/about">About</NavLink>
            </nav>
        </header>
    )
}
