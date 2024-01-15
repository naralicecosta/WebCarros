import { useEffect } from 'react'
import logo from '../../assets/logo.svg'
import { Container } from '../../components/container/Container'
import { Link, useNavigate } from 'react-router-dom'

import { Input } from '../../components/input/Input'
import {useForm, } from 'react-hook-form'
import {z} from 'zod'
import {zodResolver} from '@hookform/resolvers/zod'

import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth } from '../../services/firebaseConnection'
import toast from 'react-hot-toast'

const schema = z.object({
    email: z.string().email("Insira um email válido").nonempty('o campo email é obrigatório'),
    password: z.string().nonempty("o campo senha é obrigatório")
})

type FormData = z.infer<typeof schema>

export function Login(){
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

    function onSubmit(data: FormData) {
        signInWithEmailAndPassword(auth, data.email, data.password)
        .then((user)=>{
            console.log("logado com sucesso")
            console.log(user)
            toast.success("logado com sucesso!")
            navigate('/dashboard', {replace: true})

        })
        .catch(err => {
            console.log("erro ao logar")
            console.log(err)
            toast.error("Erro ao fazer o login")
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
                        Acessar
                     </button>
                    
                </form>

                <Link to='/register'>
                Ainda não possui uma conta? Cadastre-se
                </Link>

            </div>
        </Container>
    )
}
