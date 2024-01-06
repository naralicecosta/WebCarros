import { Header } from "../header/Header"
import { Outlet } from "react-router-dom"

export function Layout(){
    return(
        <>
        <Header/>
        <Outlet />
        </>
    )
}
