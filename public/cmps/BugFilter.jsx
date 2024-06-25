const { useState, useEffect } = React

export function BugFilter({ filterBy, onSetFilterBy, labels: availableLabels, }) {
    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)

    useEffect(() => {
        onSetFilterBy(filterByToEdit)
    }, [filterByToEdit])

    function handleChange({ target }) {
        const field = target.name
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

    function onHandleLabelChange({ target }) {
        const { name: label, checked: isChecked } = target

        setFilterByToEdit(prevFilter => ({
            ...prevFilter,
            pageIdx: 0,
            labels: isChecked
                ? [...prevFilter.labels, label]
                : prevFilter.labels.filter(lbl => lbl !== label)
        }))
    }

    const { title, severity, pageIdx, labels, sortBy, sortDir } = filterByToEdit
    return (
        <section className="bug-filter">
            <h2>Bugs Filter</h2>
            <label htmlFor="title">Name: </label>
            <input
                value={title}
                onChange={handleChange}
                type="text"
                placeholder="By Title"
                id="title"
                name="title"
            />

            <label htmlFor="severity">Min Severity: </label>
            <input
                value={severity}
                onChange={handleChange}
                type="number"
                placeholder="By Severity"
                id="severity"
                name="minSeverity"
            />

            <fieldset>
                <legend>Labels:</legend>
                {availableLabels.map((label, idx) => {
                    return <label htmlFor={label} key={idx}>
                        <input
                            type="checkbox"
                            id={label}
                            name={label}
                            checked={labels.includes(label)}
                            onChange={onHandleLabelChange}
                        />
                        {label}
                    </label>
                })}
            </fieldset>

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

            <div>
                <button onClick={() => onGetPage(-1)}>⫷ Previous</button>
                <span>{pageIdx + 1}</span>
                <button onClick={() => onGetPage(1)}>Next ⫸</button>
            </div>
        </section>
    )
}