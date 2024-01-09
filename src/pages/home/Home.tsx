import { Container } from "../../components/container/Container"
import {useState, useEffect} from 'react'

import { collection, query, getDocs, orderBy } from "firebase/firestore"
import { db } from "../../services/firebaseConnection"
import { Link } from "react-router-dom"
interface CarsProps{
    id: string;
    name: string;
    year: string;
    uid: string;
    price: number | number;
    city: string;
    km: string;
    images: CarImageProps[]
}
interface CarImageProps{
    name: string;
    uid: string;
    url: string
}

export function Home(){
    const [cars, setCars] = useState<CarsProps[]>([])

    useEffect(() => {
        function loadCar(){
            const carsRef = collection(db, "cars");
            const queryRef = query(carsRef, orderBy("created", "desc"))

            getDocs(queryRef)
            .then((snapshot) => {
                let listCars = [] as CarsProps[]
                snapshot.forEach(doc => {
                    listCars.push({
                        id: doc.id,
                        name: doc.data().name,
                        year: doc.data().year,
                        km: doc.data().km,
                        city: doc.data().city,
                        price: doc.data().price,
                        images: doc.data().images,
                        uid: doc.data().uid,
                    })
                })
                setCars(listCars)
            })
        }
    })
    return(
        <Container>
        <section className=" bg-white p-4 rounded-lg w-full max-x-3xl mx-auto flex justify-center items-center gap-2">
            <input 
            className="w-full border-2 rounded-lg h-9 px-3"
            placeholder="Digite o nome de um carro"/>

            <button
            className="bg-red-500 h-9 px-8 rounded-lg text-white font-medium text-lg">
                Buscar
            </button>
        </section>

        <h1 className="font-bold  text-center mt-6 text-2xl mb-4">
            Carros novos e usados em todo o Brasil
        </h1>
        <main className="grid gird-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

            {cars.map(car => (
                 <Link key={car.id} to={`car/${car.id}`}>
                    <section className="w-full bg-white rounded-lg">
                        <img
                        className="w-full rounded-lg mb-2 max-h-72 hover:scale-105 transition-all"
                        src={car.images[0].url}
                        alt="carro"/>
                        <p className="font-bols mt-1 mb-2 px-2">{car.name}</p>
        
                        <div className="flex flex-col px-2">
                            <span className="text-zinc-700 mb-6">Ano {car.year} | {car.km}</span>
                            <strong className="text-black font-medium text-xl">{car.price}</strong>
                        </div>
        
                        <div className="w-full h-px bg-slate-200 my-2">

                        </div>
                        <div className="px-2 pb-2">
                            <span className="text-zinc-700">
                                {car.city}
                            </span>
                        </div>
                    </section>
                 </Link>
            ))}

            


        </main>
        </Container>
    )
}
