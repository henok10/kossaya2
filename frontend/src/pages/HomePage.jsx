import React from "react";
import HouseList from "../components/HomeList";
import { useSelector } from "react-redux";

const HomePage = () => {
    const isCustomer = useSelector((state) => state.auth.isCustomer);
    const UserName = useSelector((state) => state.auth.username);
    const Token = useSelector((state) => state.auth.token);
    const Email = useSelector((state) => state.auth.email);
    const isOwner= useSelector((state) => state.auth.isOwner);
    const UserId= useSelector((state) => state.auth.userId);
    const CustomerId= useSelector((state) => state.auth.customerId);
    const OwnerId= useSelector((state) => state.auth.ownerId);
    const isAuthenticated= useSelector((state) => state.auth.isAuthenticated);
    const username= useSelector((state) => state.auth.username);

    
    console.log(Email)
    console.log(UserName)
    console.log(Token)
    console.log(isOwner)
    console.log(UserId)
    console.log(OwnerId)
    console.log(CustomerId)
    console.log(isAuthenticated)
    console.log(username)
    console.log(isCustomer)
  return (
    <>
      <HouseList />
      
    </>
  );
};

export default HomePage;

