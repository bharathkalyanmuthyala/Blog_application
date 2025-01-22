import React, { useEffect } from 'react'
import {useForm} from 'react-hook-form'
import {useNavigate} from 'react-router-dom'
import { useDispatch,useSelector } from 'react-redux';
import { userAuthorLoginThunk } from '../Redux/slices/userAuthorSlice';

function Signin() {
    let {register,handleSubmit}=useForm();
    let{loginUserStatus,errorOccured,errMsg,currentUser}=useSelector(state=>state.userAuthorLoginReducer)
    let dispatch=useDispatch();
    let navigate=useNavigate();

    function handleFormSubmit(userObj){
        console.log(userObj);
        dispatch(userAuthorLoginThunk(userObj));
    }
    useEffect(()=>{
        if(loginUserStatus===true){
            if(currentUser.userType==='user'){
        navigate('/userprofile');}
           else if(currentUser.userType==='author'){
            navigate('/authorprofile');
           }}
    },[loginUserStatus])
  return (
    <div>
        <form className='d-block mx-auto w-50 card bg-light mt-4 px-2' onSubmit={handleSubmit(handleFormSubmit)}>
            <h3 className='text-center text-success mt-2 '>Login form</h3>
            <label htmlFor='userType' className='mf-3 me-3'>Login as</label>
            <br></br>
            <div className='m-3 d-flex'>
                <div className='me-3'>
            <input type='radio' value='user' id='user' name='userType' {...register('userType',{required:true})}/>
            <label htmlFor='user'>User</label>
            </div>
            <div className='me-3'>
            <input type='radio' value='author' id='author' name='userType'{...register('userType',{required:true})}/>
            <label htmlFor='author'>Author</label>
            </div>
            </div>
            <div className='m-3'>
                <label htmlFor='username' className='form-label'>Username</label>
                <input className='form-control' id='username' placeholder='Enter Username' {...register('username',{required:true})}/>
            </div>
            <div className='m-3'>
                <label htmlFor='password' className='form-label'>Password</label>
                <input className='form-control' id='password' placeholder='Enter Password' type='password' autoComplete='off'{...register('password',{required:true})}/>
            </div>
            <button type='submit' className='btn btn-warning d-block mx-auto'>Login</button>
        </form>
    </div>
  )
}

export default Signin