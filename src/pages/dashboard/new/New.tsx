import { Container } from "../../../components/container/Container"
import { DashboardHeader } from "../../../components/panel_header/DashboardHeader"

import {FiUpload} from 'react-icons/fi'
import { FiTrash } from "react-icons/fi"
import {useForm } from 'react-hook-form'
import { Input } from "../../../components/input/Input"
import {z} from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { ChangeEvent, useState, useContext } from "react"
import { AuthContext } from "../../../contexts/AuthContext"
import {v4 as uuidV4} from 'uuid'
import { storage, db } from "../../../services/firebaseConnection"
import {ref, uploadBytes, getDownloadURL, deleteObject} from 'firebase/storage'
import { addDoc, collection } from "firebase/firestore"

const schema = z.object({
    name: z.string().nonempty("o campo nome é obrigatório"),
    model: z.string().nonempty("o modelo é obrigatório"),
    year: z.string().nonempty("o ano do carro é obrigatório"),
    km: z.string().nonempty("o km do carro é obrigatório"),
    price: z.string().nonempty("o preço pe obrigatório"),
    city: z.string().nonempty("a cidade é obrigatória"),
    whatsapp: z.string().min(1, 'o telefone é obrigatório').refine((value) => /^(\d{10,12})$/.test(value),{
        message: "Número de telefone inválido"
    }),
    description: z.string().nonempty("a descrição é obrigatória")
})

type FormData = z.infer<typeof schema>;

interface ImageItemProps{
    uid: string;
    name: string;
    previewUrl: string;
    url: string;
}

export function New(){
    const {user} = useContext(AuthContext)
    const {register, handleSubmit, formState: {errors}, reset} = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange"
    })
    const [carImages, setCarImages] = useState<ImageItemProps[]>([])

    async function handleFile(e: ChangeEvent<HTMLInputElement> ){
        if(e.target.files && e.target.files[0]){
            const image = e.target.files[0]

            if(image.type === 'image/jpeg' || image.type === 'image/png'){
                await handleUpload(image)
            }else{
                alert("Envie uma imagem jpeg ou png!")
                return;
            }
        }
    }
    async function handleUpload(image: File){
        if(!user?.uid){
            return
        }
        const currentUid = user?.uid;
        const uidImage = uuidV4();
        const uploadRef = ref(storage, `images/${currentUid}/${uidImage}`)
        uploadBytes(uploadRef, image)
        .then((snapshot) =>{
            getDownloadURL(snapshot.ref).then((downloadUrl)=>{
                const imageItem = {
                    name: uidImage,
                    uid: currentUid,
                    previewUrl: URL.createObjectURL(image),
                    url: downloadUrl,
                }
                setCarImages((images) =>[...images, imageItem])
            })
        })
    }

    function onSubmit(data: FormData) {
        if(carImages.length === 0){
            alert("Envie alguma imagem deste carro!")
            return;
        }
        const carListImages = carImages.map(car => {
            return{
                uid: car.uid,
                name: car.name,
                url: car.url
            }
        })
        addDoc(collection(db, "cars"),{
            name: data.name,
            model: data.model,
            whatsapp: data.whatsapp,
            city: data.city,
            year: data.year,
            km: data.km,
            price: data.price,
            description: data.description,
            created: new Date(),
            owner: user?.name,
            uid: user?.uid,
            images: carListImages,
        })
        .then(() => {
            reset()
            setCarImages([])
            console.log("Cadastrado com sucesso")

        })
        .catch((error) => {
            console.log(error)
            console.log("Erro ao cadastrar no banco")
        })
    }

    async function handleDeleteImage(item: ImageItemProps){
        const imagePath = `images/${item.uid}/${item.name}`
        const imageRef = ref(storage, imagePath)
        try{
            await deleteObject(imageRef)
            setCarImages(carImages.filter((car) => car.url !== item.url))
        }catch(err){
            console.log("ERRO AO DELETAR")
        }
    }

    return(
        <Container>
            <DashboardHeader />

            <div className="w-full bg-white p3 rounded-lg flex flex-col sm:flex-row items-center gap-2">
                <button className="border-2 w-48 rounded-lg flex items-center justify-center cursor-pointer border-gray-600 h-32 md:w-48">
                    <div className="absolute cursor-pointer">
                        <FiUpload size={30} color='#000'/>
                    </div>
                    <div className="cursor-pointer">
                        <input
                         type='file'
                          accept="image/*" className="opacity-0 cursor-pointer" onChange={handleFile}/>
                    </div>
                </button>

                {carImages.map(item => (
                    <div key={item.name} className="w-full h-32 flex items-center justify-center relative">
                        <button className="absolute" onClick={() => handleDeleteImage(item)}>
                            <FiTrash size={28} color='#fff'/>
                        </button>
                        <img src={item.previewUrl}
                        className="rounded-lg w-full h-32 object-cover"
                        alt="foto do carro"/>
                    </div>

                ))}
            </div>

            <div className="w-full bg-shite p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2 mt-2">
                <form
                className="w-full"
                onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3">
                        <p className="mb-2 font-medium">Nome do carro</p>
                        <Input 
                        type="text"
                        register={register}
                        name="name"
                        error={errors.name?.message}
                        placeholder="Ex: Onix 1.0"/>
                    </div>

                    <div className="mb-3">
                        <p className="mb-2 font-medium">Modelo do carro</p>
                        <Input 
                        type="text"
                        register={register}
                        name="model"
                        error={errors.model?.message}
                        placeholder="Ex: 1.0 flex plus manual"/>
                    </div>

                    <div className="flex w-full mb-3 flex-row items-center gap-4">
                        <div className="w-full">
                            <p className="mb-2 font-medium">Ano do carro</p>
                            <Input 
                            type="text"
                            register={register}
                            name="model"
                            error={errors.year?.message}
                            placeholder="Ex: 2016/2016"/>
                        </div>

                        <div className="w-full">
                            <p className="mb-2 font-medium">KM rodado</p>
                            <Input 
                            type="text"
                            register={register}
                            name="km"
                            error={errors.km?.message}
                            placeholder="Ex: 23.890"/>
                        </div>

                    </div>

                    <div className="flex w-full mb-3 flex-row items-center gap-4">
                        <div className="w-full">
                            <p className="mb-2 font-medium">telefone para contato/whatsapp</p>
                            <Input 
                            type="text"
                            register={register}
                            name="whatsapp"
                            error={errors.whatsapp?.message}
                            placeholder="Ex: 084988222488"/>
                        </div>

                        <div className="w-full">
                            <p className="mb-2 font-medium">Cidade</p>
                            <Input 
                            type="text"
                            register={register}
                            name="city"
                            error={errors.city?.message}
                            placeholder="Ex: Natal/RN"/>
                        </div>

                    </div>

                    <div className="mb-3">
                        <p className="mb-2 font-medium">Preço</p>
                        <Input 
                        type="text"
                        register={register}
                        name="price"
                        error={errors.price?.message}
                        placeholder="Ex: R$78.000"/>
                    </div>

                    <div className="mb-3">
                        <p className="mb-2 font-medium">Descrição</p>
                        <textarea className="border-2 w-full rounded-md h-24 px-2"
                        {...register("description")}
                        name="description"
                        id="description"
                        placeholder="Digite a descrição completa sobre o carro..."/>
                        {errors.description && <p className="mb-1 text-red-500">{errors.description.message}</p>}

                    </div>
                    <button type="submit" className="w-full rounded-md bg-zinc-900 text-white font-medium h-10">
                        Cadastrar carro
                    </button>
                </form>
            </div>
        </Container>
    )
}
