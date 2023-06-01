import React, { useState } from "react";
import {Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage"
import CustomerSignup from "./pages/authentication/CustomerSignup"
import OwnerSignup from "./pages/authentication/OwnerSignup"
import Login from "./pages/authentication/Login"
import Sidebar from "./components/Sidebar";
import Register from "./pages/authentication/Register";
import BottomNav from "./components/BottomNav";
import './App.css';
import Topbar from './components/Topbar';
import Order from "./pages/Order";
import TheMapComponent from './components/TheMapComponent';
import Listings from "./pages/Listings";
import ListingDetail from "./pages/ListingDetail";
import ListingOwnerDetail from "./pages/ListingOwnerDetail";
import ListingAdd  from "./pages/ListingsAdd";
import ListingUpdate from "./pages/ListingUpdate";
import ProfileOwner from "./pages/ProfileCostOwner";
import ProfileCustomer from "./pages/ProfileCustomer";
import DataTable from "./pages/DataKos.jsx";
import DataTableApprove from "./pages/DataKosApprove";
import DataTableUser from "./pages/DataKosUser";
import Footer from "./components/Footer";
import CustomerHome from "./pages/HomeCustomer";
import OwnerHome from "./pages/HomeOwner";
import RiwayatTransaksi from "./pages/RiwayatTransaksi";
import ResetPassword from "./pages/authentication/PasswordReset";
import SendPasswordResetEmail from "./pages/authentication/SendPasswordResetEmail";
import ChangePassword from "./pages/authentication/PasswordChange";


function App() {
  const [isSidebar, setIsSidebar] = useState(true);
  return (
          <div className="app">
            <Sidebar className="sidebar" isSidebar={isSidebar} />
            <main className="content">
              <Topbar setIsSidebar={setIsSidebar} />        
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/customer/signup" element={<CustomerSignup />} />
                  <Route path="/owner/signup" element={<OwnerSignup />} />
                  <Route path="/customer/home" element={<CustomerHome />} />
                  <Route path="/owner/home" element={<OwnerHome />} />
                  <Route path="/login" element={<Login />} />

                  <Route path="api/user/reset/:id/:token" element={<ResetPassword />} />
                  <Route path="/sendpasswordresetemail" element={<SendPasswordResetEmail />} />
                  <Route path="/changePassword" element={<ChangePassword />} />

                  <Route path="/listings" element={<Listings />} />                
                  <Route path="/register" element={<Register />} />
                  <Route path="/coba" element={<TheMapComponent />} />
                  <Route path="/order/:id" element={<Order />} />
                  <Route path="/profileOwner" element={<ProfileOwner />} />
                  <Route path="/profileCustomer" element={<ProfileCustomer />} />
                  <Route path="/listings/:id" element={<ListingDetail />} />
                  <Route path="/listingadd" element={<ListingAdd />} />
                  <Route path="/listingupdate" element={<ListingUpdate />} />
                  <Route path="/listingsOwner/:id" element={<ListingOwnerDetail />} />
                  <Route path="/datakos" element={<DataTable />} />
                  <Route path="/datakosApprove/:id" element={<DataTableApprove />} />
                  <Route path="/datakosUser/:id" element={<DataTableUser />} />
                  <Route path="/riwayatTransaksi" element={<RiwayatTransaksi />} />
                </Routes>
                <BottomNav />
                {/* <Footer /> */}
              </main>            
          </div>      
    
  );
}

export default App;
