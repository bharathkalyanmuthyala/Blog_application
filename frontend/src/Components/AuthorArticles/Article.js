import React from 'react'
import { useState } from 'react';
import { useLocation,useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';
import {useForm} from 'react-hook-form'
import { FaEdit } from "react-icons/fa";
import { FaUserAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { axiosWithToken } from '../AxiosWithToken';
import { MdRestore } from "react-icons/md";
function Article() {
  let navigate=useNavigate();
  let { state } = useLocation();
  let { currentUser } = useSelector((state) => state.userAuthorLoginReducer);

  let {register,handleSubmit}=useForm();
 let [comment,setComment]=useState("")
  const writeComment=async(commentObj)=>{
        commentObj.username=currentUser.username;
       let res= await axiosWithToken.post(`http://localhost:4000/userapi/comment/${state.articleId}`,commentObj)
       if(res.data.message==='comment posted'){
        setComment(res.data.message);
         
       }
  }
  let [articleeditStatus,setarticleeditStatus]=useState(false);
  let [currentArticle,setCurrentArticle]=useState(state)
  

  const deleteArticle = async() => {
    let art={...currentArticle};
   
    delete art._id;
    let res=await axiosWithToken.put(`http://localhost:4000/authorapi/article/${currentArticle.articleId}`,art)
    if(res.data.message==='article deleted'){
      setCurrentArticle({...currentArticle,status:res.data.payload})
    }
  };

  const restoreArticle =async () => {
    let art={...currentArticle};
    console.log("article restoring")
    console.log(art)
    delete art._id;
    let res=await axiosWithToken.put(`http://localhost:4000/authorapi/article/${currentArticle.articleId}`,art)
    if(res.data.message==='article restored'){
      setCurrentArticle({...currentArticle,status:res.data.payload})
    }
  };

  //const enableeditstatus
  const enableeditstatus=()=>{
    setarticleeditStatus(true);
  }

  const disableeditstatus=async(editedArticle)=>{
    let modifiedArticle={...state,...editedArticle}
    //change dateof modification
    modifiedArticle.dateOfModification=new Date();
    delete modifiedArticle._id;
  //making http request to edit article 
    let res=await axiosWithToken.put('http://localhost:4000/authorapi/article',modifiedArticle)
    if(res.data.message==='Article is modified'){
      
      setarticleeditStatus(false);
      navigate(`/authorprofile/article/${modifiedArticle.articleId}`,{state:res.data.article});

    }
    
  }
  // Check if state is null or undefined
  if (!state) {
    return <div>Error: Article data is not available.</div>;
  }
  function ISOtoUTC(iso) {
    let date = new Date(iso).getUTCDate();
    let month = new Date(iso).getUTCMonth()+1;
    let year = new Date(iso).getUTCFullYear();
    return `${date}/${month}/${year}`;
  }

  return (
    <div>
      {articleeditStatus===false?(<><div className='card m-2 px-4 bg-light'>
        <div className='card-body'>
          {currentUser.userType === 'author' && (<>
            <div class='d-flex justify-content-end'>

              <button class='btn btn-warning me-2' onClick={enableeditstatus}><FaEdit /></button>
              {currentArticle.status === true ? (
                    <button
                      className="me-2 btn btn-danger"
                      onClick={deleteArticle}
                    >
                      <MdDelete className="fs-2" />
                    </button>
                  ) : (
                    <button
                      className="me-2 btn btn-info"
                      onClick={restoreArticle}
                    >
                      <MdRestore className="fs-2" />
                    </button>
                  )}
            </div>
          </>)}
            < h3 style={{ whiteSpace: "pre-line" }} className='text-center'><span className='text-danger'>Title</span>:{state.title}</h3>
        <h4 style={{ whiteSpace: "pre-line" }} ><span className='text-danger'>Category</span>:{state.category}</h4>
        <div className='d-inline g-3'>
          <h5 style={{ whiteSpace: "pre-line" }} className='text-dark'><span className='text-primary'>DateOfCreation</span>:{ISOtoUTC(state.dateOfCreation)}</h5>
          <h5 style={{ whiteSpace: "pre-line" }} className='text-dark'><span className='text-primary'>DateOfModification</span>:{ISOtoUTC(state.dateOfModification)}</h5>
        </div>


        <p className='fs-5 lead' style={{ whiteSpace: "pre-line" }}><span className='text-danger'>Content</span>:{state.content}</p>
        <div>
          <div className='comments my-4'>
            
            {state.comments.length===0?(
              <p className='display-4'>No Comments Yet..</p>
            ):(
              state.comments.map((commentObj,ind)=>{
                return(
                  <div key={ind} className='bg-light p-3 card g-2'>
                    <p className='fs-4' style={{color:"dodgerblue",textTransform:"capitalize"}}><FaUserAlt className='fs-2 me-2 btn btn-red'/><span className='text-warning'>Username</span>:{commentObj.username}</p>
                    <p className='fs-4'  style={{fontFamily:"sans-serif"}}><span className='text-warning'>Comment</span>:{commentObj.comment}</p>
                  </div>
                )
              })
            )}

          </div>
        </div>
        <h2>{comment}</h2>
        {currentUser.userType==='user'&&(<>
        <form onSubmit={handleSubmit(writeComment)}>
          <input type='text' {...register('comment')} className='form-control mb-2' placeholder='Write comment here...'/>
          <button className='btn btn-primary d-block mx-auto' type='submit'>POST</button>
        </form>
        </>)}

      </div>
    </div></>):
    (<>
     <form className='w-50 card d-block mx-auto mt-2 bg-light' onSubmit={handleSubmit(disableeditstatus)}>
        <div className='m-3'>
          <label className='form-label' htmlFor='title'>Title:</label>
          <input className='form-control' type='text' id='title' placeholder='Enter title' {...register('title',{required:true})} defaultValue={state.title}/>
        </div>
        <div className='m-3'>
          <label className='form-label' htmlFor='category'>
            Category:
            <select className='form-control mt-1'id='category' {...register('category',{required:true})} defaultValue={state.category}>
              <option value=''>Select a Category</option>
              <option value='programming'>programming</option>
              <option value='science'>science</option>
              <option value='Fashion'>Fashion</option>
              <option value='lifeStyle'>lifeStyle</option>
            </select>
          </label>
        </div>
        <div className='m-2'>
          <label className='form-label' >Content:</label>
          <textarea className='form-control'  cols='40' rows='10' placeholder='Enter content'{...register('content',{required:true})} defaultValue={state.content}/>

        </div>
        <button className='btn btn-success d-block mx-auto'type='submit' >SAVE</button>
      </form>
    </>)}
      
    </div >
  )
}

export default Article