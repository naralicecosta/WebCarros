import { ReactNode } from "react"

export function Container({children}: {children: ReactNode}){
    return(
        <div className="w-full max-x-7xl mx-auto px-4">
            {children}
        </div>
    )
}