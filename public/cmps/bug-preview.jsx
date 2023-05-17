

export function BugPreview({bug}) {

    return <div>
        <h4 className="prev-title">{bug.title}</h4>
        <h1>🐛</h1>
        <p>Severity: <span>{bug.severity}</span></p>
        
    </div>
}