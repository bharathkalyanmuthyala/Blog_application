import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';

function Signup() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [err, setErr] = useState('');

    async function handleFormSubmit(userObj) {
        try {
            let endpoint = '';
            if (userObj.userType === 'user') {
                endpoint = 'http://localhost:4000/userapi/user';
            } else if (userObj.userType === 'author') {
                endpoint = 'http://localhost:4000/authorapi/author';
            }

            let res = await axios.post(endpoint, userObj);

            if (res.data.message === 'user created' || res.data.message === 'author registered') {
                navigate('/sign-in');
            } else {
                setErr(res.data.message);
            }
        } catch (error) {
            setErr(error.response?.data?.message || 'An error occurred');
        }
    }

    return (
        <div className=''>
            {err && <p className='text-danger text-center fs-3'>{err}</p>}
            <form className='w-50 d-block mx-auto mt-4 card bg-light px-4' onSubmit={handleSubmit(handleFormSubmit)}>
                <h3 className='text-center text-warning mt-2'>Registration form</h3>
                <div className='m-3 '>
                    <label htmlFor='userType' className='form-label'>Register as</label>
                    <br />
                    <div className='d-flex '>
                        <div className='me-3'>
                            <input type='radio' id='user' value='user' name='userType' {...register('userType', { required: true })} />
                            <label htmlFor='user' className='form-label'>User</label>
                        </div>
                        <div className='me-3'>
                            <input type='radio' id='author' value='author' name='userType' {...register('userType', { required: true })} />
                            <label htmlFor='author' className='form-label'>Author</label>
                        </div>
                    </div>
                </div>
                <div className='m-3'>
                    <label className='form-label' htmlFor='username'>Username</label>
                    <input className='form-control' id='username' placeholder='Enter username' type='text' {...register('username', { required: true })} />
                    {errors.username && <p className='text-danger'>Username is required</p>}
                </div>
                <div className='m-3'>
                    <label className='form-label' htmlFor='email'>Email</label>
                    <input className='form-control' id='email' placeholder='Enter Email' type='email' {...register('email', { required: true })} />
                    {errors.email && <p className='text-danger'>Email is required</p>}
                </div>
                <div className='m-3'>
                    <label className='form-label' htmlFor='password'>Password</label>
                    <input className='form-control' id='password' placeholder='Enter Password' type='password' autoComplete='off'{...register('password', { required: true })} />
                    {errors.password && <p className='text-danger'>Password is required</p>}
                </div>
                <button type='submit' className='btn btn-success d-block mx-auto'>Submit</button>
            </form>
        </div>
    );
}

export default Signup;
