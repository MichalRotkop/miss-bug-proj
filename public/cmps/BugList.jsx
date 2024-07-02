const { Link } = ReactRouterDOM

import { BugPreview } from './BugPreview.jsx'

export function BugList({ bugs, onRemoveBug, onEditBug, isInProfile = false }) {
  return (
    <ul className="bug-list">
      {bugs.map((bug) => (
        <li className="bug-preview" key={bug._id}>
          <BugPreview bug={bug} />
          {isInProfile && <div>
            <button onClick={() => { onRemoveBug(bug._id) }}>x</button>
            <button onClick={() => { onEditBug(bug) }}>Edit</button>
          </div>}
          <Link to={`/bug/${bug._id}`}>Details</Link>
        </li>
      ))}
    </ul>
  )
}
