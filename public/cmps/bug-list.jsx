const { Link } = ReactRouterDOM

import { BugPreview } from "./bug-preview.jsx"

export function BugList({ bugs, onRemoveBug }) {
    return <ul className="bug-list">
        {bugs.map(bug =>
            <li className="bug-preview" key={bug._id}>
                <BugPreview bug={bug}  />
                <div className="options">
                    <Link className="btn" to={`/bug/${bug._id}`}>Details</Link>
                    <Link className="btn" to={`/bug/edit/${bug._id}`}>Edit</Link>
                    <button className="btn" onClick={() => { onRemoveBug(bug._id) }}><i className="fa-solid fa-x"></i></button>
                </div>
            </li>)}
    </ul>
}