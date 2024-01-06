import logo from '../../assets/logo.svg'
import { Container } from '../../components/container/Container'
import { Link } from 'react-router-dom'

import { Input } from '../../components/input/Input'
import {useForm, } from 'react-hook-form'
import {z} from 'zod'
import {zodResolver} from '@hookform/resolvers/zod'

const schema = z.object({
    email: z.string().email("Insira um email válido").nonempty('o campo email é obrigatório'),
    password: z.string().nonempty("o campo senha é obrigatório")
})

type FormData = z.infer<typeof schema>

export function Login(){
    const {register, handleSubmit, formState: {errors}}= useForm<FormData>({
        resolver: zodResolver(schema),
        mode: 'onChange',
    })

    function onSubmit(data: FormData) {
        console.log(data)
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

            </div>
        </Container>
    )
}
