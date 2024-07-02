import { bugService } from "../services/bug.service.js"
import { BugList } from "../cmps/BugList.jsx"
import { userService } from "../services/user.service.js"

const { useParams, useNavigate } = ReactRouterDOM
const { useState, useEffect } = React


export function UserDetails() {
    const params = useParams()
    const navigate = useNavigate()

    const [user, setUser] = useState(null)
    const [userBugs, setUserBugs] = useState([])

    useEffect(() => {
        loadUser()
    }, [params.userId])

    useEffect(() => {
        if (!user) return
        bugService.query({ userId: user._id, pageIdx: 0 })
            .then(setUserBugs)
            .catch(err => console.log('err', err))
    }, [user])

    function loadUser() {
        userService.getUser(params.userId)
            .then(setUser)
            .catch(err => {
                console.log('err', err)
                navigate('/')
            })
    }
    
    if (!user) return <div>Loading...</div>
    return (
        <section className="user-details">
            <h1>{user.fullname} Bugs:</h1>
            <BugList bugs={userBugs} isProfile={true} />
            <button onClick={() => navigate('/')}>Back</button>
        </section>
    )

}