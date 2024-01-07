import {ReactNode, useContext} from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { Navigate } from 'react-router-dom'

interface PrivateProps{
    children: ReactNode
}

export function Private({children}: PrivateProps): any{
    const {signed, loadingAuth} = useContext(AuthContext)
    //caso o usuario tente entrar em alguma rota privada, mas ele nao estiver logado
    if(loadingAuth){
        return <div></div>
    }
    if(!signed){
        return <Navigate to='/login'/>
    }
    //se ele tiver logado, pode acessar
    return children
}