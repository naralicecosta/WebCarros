import { Container } from "../../../components/container/Container"
import { DashboardHeader } from "../../../components/panel_header/DashboardHeader"

import {FiUpload} from 'react-icons/fi'

export function New(){
    return(
        <Container>
            <DashboardHeader />

            <div className="w-full bg-white p3 rounded-lg flex flex-col sm:flex-row items-center gap-2">
                <button className="border-2 w-48 rounded-lg flex items-center justify-center cursor-pointer border-gray-600 h-32 md:w-48">
                    <div className="absolute cursor-pointer">
                        <FiUpload size={30} color='#000'/>
                    </div>
                    <div className="cursor-pointer">
                        <input type='file' accept="'image" className="opacity-0 cursor-pointer"/>
                    </div>
                </button>
            </div>

            <div className="w-full bg-shite p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2 mt-2">
                <h1>teste</h1>

            </div>
        </Container>
    )
}
