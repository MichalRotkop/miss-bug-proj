
const { useState, useEffect } = React

export function BugFilter({ filterBy, onSetFilterBy }) {

    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)

    useEffect(() => {
        console.log('filterByToEdit', filterByToEdit);
        onSetFilterBy(filterByToEdit)
    }, [filterByToEdit])

    function handleChange({ target }) {
        var field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value || ''
                break;

            case 'checkbox':
                value = target.checked ? -1 : 1
                break

            default:
                break;
        }

        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value, pageIdx: 0 }))
    }

    function onGetPage(diff) {
        if (filterByToEdit.pageIdx + diff < 0) return
        setFilterByToEdit(prevFilter => ({ ...prevFilter, pageIdx: prevFilter.pageIdx + diff }))
    }

    function onHandleLabelsChange({ target }) {
        var value = []
        if (target.checked) {
            value = [...filterByToEdit.labels, target.name]
        } else {
            value = filterByToEdit.labels.filter(label => label !== target.name)
        }
        setFilterByToEdit(prevFilter => ({ ...prevFilter, labels: value, pageIdx: 0 }))
    }

    const { title, severity, pageIdx } = filterByToEdit
    return (
        <section className="bug-filter">
            <h2>Bugs Filter</h2>
            <label htmlFor="title">Name: </label>
            <input value={title} onChange={handleChange} type="text" placeholder="By Title" id="title" name="title" />

            <label htmlFor="severity">Min Severity: </label>
            <input value={severity} onChange={handleChange} type="number" placeholder="By Severity" id="severity" name="minSeverity" />

            <fieldset>
                <legend>Labels:</legend>

                <input type="checkbox" id="critical" name="critical" onChange={onHandleLabelsChange} />
                <label htmlFor="critical">Critical</label>

                <input type="checkbox" id="need-cr" name="need-CR" onChange={onHandleLabelsChange} />
                <label htmlFor="need-cr">Need-CR</label>

                <input type="checkbox" id="dev-branch" name="dev-branch" onChange={onHandleLabelsChange} />
                <label htmlFor="dev-branch">Dev-Branch</label>
            </fieldset>

            <div>
                <button onClick={() => onGetPage(-1)}>⫷ Previous</button>
                <span>{pageIdx + 1}</span>
                <button onClick={() => onGetPage(1)}>Next ⫸</button>
            </div>

            <div>
                <label htmlFor="sortBy">Sort By:</label>
                <select id="sortBy" name="sortBy" onChange={handleChange}>
                    <option value="">Select</option>
                    <option value="title">Title</option>
                    <option value="severity">Severity</option>
                    <option value="createdAt">Created At</option>
                </select>
                <label htmlFor="sortDir">Descending</label>
                <input type="checkbox" id="sortDir" name="sortDir" onChange={handleChange} />
            </div>
        </section>
    )
}