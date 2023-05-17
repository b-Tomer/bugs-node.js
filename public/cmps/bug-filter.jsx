// import { bugService } from "../services/bug.service.js"

const { useState, useEffect } = React;

export function BugFilter({ onCheckBoxs, onSetSort, filterBy, onSetFilter, onAddBug }) {
  const [filterByToEdit, setFilterByToEdit] = useState(filterBy);

  useEffect(() => {
    onSetFilter(filterByToEdit);
  }, [filterByToEdit]);
  function handleChange({ target }) {
    const field = target.name;
    const value = target.type === "number" ? +target.value || "" : target.value;
    setFilterByToEdit((prevFilterBy) => ({ ...prevFilterBy, [field]: value }));
  }

  function onSubmitFilter(ev) {
    ev.preventDefault();
    onSetFilter(filterByToEdit);
  }

  function onCritical({ target }) {
    let isCritical = target.checked
   if (isCritical) onCheckBoxs({critical:true})
   else onCheckBoxs({critical:false})
  }
  
  function onNeedCR({ target }) {
    let isNeedCr = target.checked
    if (isNeedCr) onCheckBoxs({needCr:true})
    else onCheckBoxs({needCr:false})
  }
  
  function onDevBranch({ target }) {
    let isDevBranch = target.checked
    if (isDevBranch) onCheckBoxs({devBranch:true})
    else onCheckBoxs({devBranch:false})
  }
  
  
  

  const { title, severity } = filterByToEdit;
  return (
    <section className="bug-filter fully">
      <p>Filters:</p>

      <form onSubmit={onSubmitFilter}>
        <div className="filter-lable">
          <label htmlFor="title">Name: </label>
          <input
            className="txt-input"
            value={title || ""}
            onChange={handleChange}
            name="title"
            id="title"
            type="search"
            placeholder="By Name"
          />
        </div>
        <div className="filter-lable">
          <label htmlFor="severity">Severity: </label>
          <input
            value={severity || ""}
            onChange={handleChange}
            type="range"
            name="severity"
            id="severity"
            placeholder="By Severity"
          />
        </div>
        <button className="filter-btn btn">Filter bugs</button>
      </form>
      <select onChange={onSetSort} className="txt-input" name="sort" id="sort">
        <option value="title">Name</option>
        <option value="createdAt">Created At</option>
        <option value="severity">Severity</option>
      </select>
      <div className="lables">
        <div>
          <input type="checkbox" onChange={onCritical} id="critical" />
          <label htmlFor="critical">Critical</label>
        </div><div>
          <input type="checkbox" onChange={onNeedCR} id="need-CR" />
          <label htmlFor="need-CR">Need-CR</label>
        </div><div>
          <input type="checkbox" onChange={onDevBranch} id="dev-branch" />
          <label htmlFor="dev-branch">'Dev-branch'</label>
        </div>
      </div>
      <button className="btn" onClick={onAddBug}>Add Bug ⛐</button>
    </section>
  );
}
