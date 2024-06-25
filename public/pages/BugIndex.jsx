import { bugService } from '../services/bug.service.js'
import { utilService } from '../services/util.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugList } from '../cmps/BugList.jsx'
import { BugFilter } from '../cmps/BugFilter.jsx'

const { useState, useEffect, useRef } = React

export function BugIndex() {
  const [bugs, setBugs] = useState([])
  const [labels, setLabels] = useState([])

  const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())
  const debouncedSetFilterBy = useRef(utilService.debounce(onSetFilterBy, 500))

  useEffect(() => {
    loadLabels()
  }, [])

  useEffect(() => {
    loadBugs()
  }, [filterBy])

  function loadBugs() {
    bugService.query(filterBy)
      .then(setBugs)
      .catch(err => {
        console.log('err', err)
        showErrorMsg('Cannot load bugs')
      })
  }

  function loadLabels() {
    bugService.getLabels()
      .then(labels => setLabels(labels))
      .catch(err => {
        console.log('err', err)
        showErrorMsg('Cannot load labels')
      })
  }

  function onRemoveBug(bugId) {
    bugService.remove(bugId)
      .then(() => {
        console.log('Deleted Succesfully!')
        setBugs(prevBugs => prevBugs.filter((bug) => bug._id !== bugId))
        showSuccessMsg('Bug removed')
      })
      .catch((err) => {
        console.log('Error from onRemoveBug ->', err)
        showErrorMsg('Cannot remove bug')
      })
  }

  function onAddBug() {
    const title = prompt('Bug title?')
    const severity = +prompt('Bug severity?')
    const description = prompt('Bug description?')
    const labelsInput = prompt('Bug labels (comma-separated)?')
    const labels = labelsInput ? labelsInput.split(',').map(label => label.trim()) : []

    const bug = {
      title,
      severity,
      description,
      labels,
    }

    bugService.save(bug)
      .then((savedBug) => {
        setBugs(prevBugs => [...prevBugs, savedBug])
        showSuccessMsg('Bug added')
      })
      .catch((err) => {
        console.log('Error from onAddBug ->', err)
        showErrorMsg('Cannot add bug')
      })
  }

  function onEditBug(bug) {
    const severity = +prompt('New severity?')
    const description = prompt('New description?')
    const bugToSave = { ...bug, severity, description }
    bugService.save(bugToSave)
      .then((savedBug) => {
        // console.log('Updated Bug:', savedBug)
        setBugs(prevBugs => prevBugs.map((currBug) =>
          currBug._id === savedBug._id ? savedBug : currBug
        ))
        showSuccessMsg('Bug updated')
      })
      .catch((err) => {
        console.log('Error from onEditBug ->', err)
        showErrorMsg('Cannot update bug')
      })
  }

  function onDownloadPdf() {
    bugService.downloadPdf()
      .then(() => {
        console.log('PDF DOWNLOAD');
        showSuccessMsg('Download pdf successfully')
      })
      .catch(err => {
        console.log('err:', err)
        showErrorMsg('Cannot download pdf')
      })
  }

  function onSetFilterBy(filterBy) {
    setFilterBy(prevFilterBy => ({ ...prevFilterBy, ...filterBy }))
  }

  return (
    <main>
      <h3>Bugs App</h3>
      <main>
        <button onClick={onDownloadPdf}>Download PDF</button>
        <BugFilter filterBy={filterBy} onSetFilterBy={debouncedSetFilterBy.current} labels={labels} />
        <button onClick={onAddBug}>Add Bug ⛐</button>
        {bugs && bugs.length
          ? <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
          : <h1>No Bugs Today...</h1>
        }
      </main>
    </main>
  )
}
