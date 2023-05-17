const { useEffect, useState } = React
const { Link, useParams, useNavigate } = ReactRouterDOM



import { bugService } from "../services/bug.service.js"
import { showErrorMsg } from "../services/event-bus.service.js"


export function BugEdit() {

    const [bugToEdit, setbugToEdit] = useState(null)
    const navigate = useNavigate()
    const params = useParams()
    console.log('params:', params)

    useEffect(() => {
        if (params.bugId) loadbug()
    }, [])

    function loadbug() {
        bugService.get(params.bugId)
            .then(setbugToEdit)
            .catch(err => {
                console.log('Had issued in bug edit:', err);
                navigate('/bug')
                showErrorMsg('bug not found!')
            })
    }


    function handleChange({ target }) {

        const field = target.name
        console.log('field: ', field);
        const value = target.type === 'number' ? (+target.value || '') : target.value
        setbugToEdit(prevbug => ({ ...prevbug, [field]: value }))

    }

    function onSavebug(ev) {
        ev.preventDefault()
        console.log(bugToEdit);
        bugService.save(bugToEdit)
            .then(() => {
                navigate('/bug')
            })
    }
    if (!bugToEdit) return <div>Loading...</div>
    console.log('bugToEdit: ', bugToEdit);
    return (
        <section className="bug-edit">
            <h2 className="edit-title">Edit bug</h2>

            <form onSubmit={onSavebug} >
                <div>

                    <label htmlFor="title">Name: </label>
                    <input className="txts-input" onChange={handleChange} value={bugToEdit.title} type="text" name="title" id="title" />
                </div>
                <div>

                    <label htmlFor="severity">Severity: </label>
                    <input className="txts-input" onChange={handleChange} value={bugToEdit.severity} type="number" name="severity" id="severity" />
                </div>
                <div>

                    <label htmlFor="description">Description: </label>
                    <input className="txts-input" onChange={handleChange} value={bugToEdit.description} type="text" name="description" id="description" />
                </div>
                <div className="btns-section">

                    <button className="btn">Save</button>
                    <Link className="btn" to="/bug">Back to List</Link>
                </div>

            </form>

        </section>
    )

}