
// I do not know what I'm doing but hopefully this works, it didn't
// Idea is that I can get a login change from multiple places and determine from that if logOut button exists

// Currently not used

import { useState } from "react"

const useLogOutHook = () => {
    const [logOut, setLogOut] = useState<boolean>(false)

    return {logOut, setLogOut }
}

export default useLogOutHook