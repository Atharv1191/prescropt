import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";

export const AdminContext = createContext()

const AdminContextProvider = (props)=>{
    const [aToken,setAToken] = useState(localStorage.getItem('aToken')?localStorage.getItem('aToken'):'')
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [doctors,setDoctors] = useState([])
    const [appointments,setAppointments] = useState([])
    const [dashData, setDashData] = useState(false)
    const getAllDoctors = async(req,res)=>{
        try {
            const {data} = await axios.post(backendUrl + '/api/admin/all-doctors',{},{headers:{aToken}})
            if(data.success){
                setDoctors(data.doctors)
                console.log(data.doctors);
            }else{
                toast.error(data.message)
            }
        }
        catch(error){
            toast.error(error.message)

        }
    }
    const ChangeAvailability = async(docId) =>{
        try {
            const {data} = await axios.post(backendUrl + '/api/admin/change-availibility',{docId},{headers:{aToken}})
            if(data.success){
                toast.success(data.message)
                getAllDoctors()
            }else{
                toast.error(error.message)
            }
        } catch (error) {
            toast.error(error.message)
        }

    }
    const getAllAppointments = async() =>{
        try {
            const {data} = await axios.get( backendUrl + '/api/admin/appointments',{headers:{aToken}})
            if(data.success){
                setAppointments(data.appointments)
            }else{
                toast.error(data.message)
            }
             
            
        } catch (error) {
            toast.error(error.message)
        }
    }
    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(
                backendUrl + '/api/admin/cancel-appointment', 
                { appointmentId }, 
                { headers: { aToken } } // Ensure aToken is defined
            );
    
            if (data.success) {
                toast.success(data.message); // Fixed typo (mesaage -> message)
                getAllAppointments();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };
    const getDashData = async()=>{
        try {
            const {data} = await axios.get(backendUrl + '/api/admin/dashboard',{headers:{aToken}})
            if(data.success){
                setDashData(data.dashData)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message);
        }
    }
    const value={
        aToken,setAToken,backendUrl,doctors,getAllDoctors,ChangeAvailability,appointments,setAppointments,getAllAppointments,cancelAppointment,dashData,getDashData
    }
    return (
        <AdminContext.Provider value ={value}>
            {props.children}
        </AdminContext.Provider>
    )
}
export default AdminContextProvider