/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom"
import { getToken } from "../utils/auth"


export const AuthGuard = ({ children }) => {
    const auth = getToken()

    if (auth) {
        return children
    }

    else {
        return <Navigate to="/" />
    }
}

export const LogGuard = ({ children }) => {
    const auth = getToken()

    if (!auth) {
        return children
    }

    else {
        return <Navigate to="/home" />
    }
}