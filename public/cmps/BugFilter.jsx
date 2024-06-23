
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
                // field = 'labels'
                // value = target.checked
                value = target.checked
                break

            default:
                break;
        }

        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value, pageIdx: 0}))
    }

    function onGetPage(diff) {
        if (filterByToEdit.pageIdx + diff < 0) return
        setFilterByToEdit(prevFilter => ({ ...prevFilter, pageIdx: prevFilter.pageIdx + diff }))
    }

    function onSetSort({ target }) {
        const dir = target.checked ? -1 : 1
        const prop = target.name === 'sort-select' ? 'all' : target.value
        // var dir = 1
        // var prop = 'all'
        // if (target.type === 'checkbox') {
        //     dir = target.checked ? -1 : 1
        // } else {
        //     prop = target.value
        // }
        setFilterByToEdit(prevFilter => ({ ...prevFilter, sortBy: { [prop]: dir } }))
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

                <input type="checkbox" id="critical" name="critical" onChange={handleChange} />
                <label htmlFor="critical">Critical</label>

                <input type="checkbox" id="need-cr" name="need-cr" onChange={handleChange} />
                <label htmlFor="need-cr">Need-CR</label>

                <input type="checkbox" id="dev-branch" name="dev-branch" onChange={handleChange} />
                <label htmlFor="dev-branch">Dev-Branch</label>
            </fieldset>

            <div>
                <button onClick={() => onGetPage(-1)}>⫷ Previous</button>
                <span>{pageIdx + 1}</span>
                <button onClick={() => onGetPage(1)}>Next ⫸</button>
            </div>

            <div>
                <label htmlFor="sort-by">Sort By:</label>
                <select id="sort-by" name="sort-select" onChange={onSetSort}>
                    <option value="">Select</option>
                    <option value="title">Title</option>
                    <option value="severity">Severity</option>
                    <option value="createdAt">Created At</option>
                </select>
                <label htmlFor="sort-dir">Descending</label>
                <input type="checkbox" id="sort-dir" onChange={onSetSort} />
            </div>
        </section>
    )
}