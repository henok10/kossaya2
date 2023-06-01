import React, {useEffect} from 'react'
import {getCustomerUser} from "../actions/auth"
import {useDispatch} from "react-redux"
import HouseList from '../components/HomeList'

 function CustomerHome() {
     const dispatch=useDispatch()
     useEffect(()=>{
         dispatch(getCustomerUser())
     }, [dispatch])
    return (
        <>
             <HouseList />
        </>
    )
}

export default CustomerHome;