import React, {useEffect} from 'react'
import {getOwnerUser} from "../actions/auth"
import {useDispatch} from "react-redux"

 function OwnerHome() {
     const dispatch=useDispatch()
     useEffect(()=>{
         dispatch(getOwnerUser())
     }, [dispatch])
    return (
        <div className='container mt-5'>
             welcome! we have talented developer ready for hired
        </div>
    )
}

export default OwnerHome;