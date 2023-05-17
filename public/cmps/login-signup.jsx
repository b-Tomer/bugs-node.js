import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
import { userService } from '../services/user.service.js'
import { CredentialsForm } from './credentials-form.jsx'

const { useState } = React

export function LoginSignup({ onChangeLoginStatus }) {

    const [isSignup, setIsSignUp] = useState(false)

    function onSubmit(credentials) {
        isSignup ? signup(credentials) : login(credentials)
    }

    function login(credentials) {
        userService.login(credentials)
            .then(onChangeLoginStatus)
            .then(() => { showSuccessMsg('Logged in successfully') })
            .catch((err) => { showErrorMsg('Oops try again') })
    }

    function signup(credentials) {
        userService.signup(credentials)
            .then(onChangeLoginStatus)
            .then(() => { showSuccessMsg('Signed in successfully') })
            .catch((err) => { showErrorMsg('Oops try again') })
    }

    return (
        <div className="credentials-page">
            <CredentialsForm
                onSubmit={onSubmit}
                isSignup={isSignup}
            />
            <div className="btns">
                <a href="#/bug" onClick={() => setIsSignUp(!isSignup)}>
                    {isSignup ?
                        'Already a member? Login' :
                        'New user? Signup here'
                    }
                </a >
            </div>
        </div >
    )
}
