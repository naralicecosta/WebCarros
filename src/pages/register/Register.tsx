import { useEffect, useContext } from 'react'
import logo from '../../assets/logo.svg'
import { Container } from '../../components/container/Container'
import { Link, useNavigate } from 'react-router-dom'

import { Input } from '../../components/input/Input'
import {useForm, } from 'react-hook-form'
import {z} from 'zod'
import {zodResolver} from '@hookform/resolvers/zod'

import { auth } from '../../services/firebaseConnection'
import { createUserWithEmailAndPassword, updateProfile, signOut } from 'firebase/auth'
import { AuthContext } from '../../contexts/AuthContext'

const schema = z.object({
    name: z.string().nonempty("o campo nome é obrigatorio"),
    email: z.string().email("Insira um email válido").nonempty('o campo email é obrigatório'),
    password: z.string().min(6,"a senha deve ter pelo menos 6 caracteres").nonempty("o campo senha é obrigatório")
})

type FormData = z.infer<typeof schema>

export function Register(){
    const {handleInfoUser} = useContext(AuthContext)
    const navigate = useNavigate()
    const {register, handleSubmit, formState: {errors}}= useForm<FormData>({
        resolver: zodResolver(schema),
        mode: 'onChange',
    })

    //se tiver logado e clicar em login, desloga o usuario
    useEffect(() => {
        async function handleLogout(){
            await signOut(auth)
        }
        handleLogout()

    },[])

    async function onSubmit(data: FormData) {
        createUserWithEmailAndPassword(auth, data.email, data.password)
        .then(async(user) => {
            await updateProfile(user.user,{
                displayName: data.name
            })
            handleInfoUser({
                name: data.name,
                email: data.email,
                uid: user.user.uid
            })
            console.log("cadastrado com sucesso")
            navigate("/dashboard", {replace: true})
        })
        .catch((error) => {
            console.log("erro ao cadastrar esse usuario")
            console.log(error)
        })

        
    }



    return(
        <Container>
            <div className='w-full min-h-screen flex justify-center items-center flex-col gap-4'>
                <Link to='/' className='mb-6 max-w-sm w-full'>
                    <img
                    src={logo}
                    alt='logo do site'
                    className='w-fll' />
                </Link>

                <form
                className='bg-white max-w-xl w-full rounded-lg'
                onSubmit={handleSubmit(onSubmit)}>

                    <div className='mb-3'>
                        <Input
                            type='text'
                            placeholder="Digite seu nome completo..."
                            name='name'
                            error={errors.name?.message}
                            register={register}
                        />
                    </div>

                    <div className='mb-3'>
                        <Input
                            type='email'
                            placeholder="Digite seu email..."
                            name='email'
                            error={errors.email?.message}
                            register={register}
                        />
                    </div>

                    <div className='mb-3'>
                        <Input
                            type='password'
                            placeholder="Digite sua senha..."
                            name='password'
                            error={errors.password?.message}
                            register={register}
                        />
                    </div>

                     <button type='submit' className='bg-zinc-900 w-full rounded-md text-white h-10 font-medium'>
                        Cadastrar
                     </button>
                    
                </form>

                <Link to='/login'>
                Já possui uma conta? faça login
                </Link>

            </div>
        </Container>
    )
}
