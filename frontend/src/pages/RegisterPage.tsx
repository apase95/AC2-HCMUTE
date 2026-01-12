import { useState } from "react";
import { RegisterForm } from "../forms/RegisterForm";
import type { AppDispatch, RootState } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../redux/authSlice";

export const RegisterPage = () => {

    const [formData, setFormData] = useState({
            fullname: "",
            email: "",
            password: "",
        });
        const [successMsg, setSuccessMsg] = useState("");
    
        const dispatch = useDispatch<AppDispatch>();
        const navigate = useNavigate();
        const { isLoading, error } = useSelector((state: RootState) => state.auth);
    
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        };
    
        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            console.log("submitting form...");
    
            const nameParts = formData.fullname.trim().split(" ");
            const firstName = nameParts[0] || "User";
            const lastName = nameParts.slice(1).join(" ") || ".";
    
            const registerData = {
                email: formData.email,
                password: formData.password,
                firstName,
                lastName,
            };
    
            console.log("Data sent to backend:", registerData);
    
            const resultAction = await dispatch(registerUser(registerData));
            if (registerUser.fulfilled.match(resultAction)) {
                setSuccessMsg("Registration successful! Redirecting to login...");
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            } else {
                console.error("Register failed:", resultAction.payload);
            }
        };
    
        const handleGoogleLogin = () => {
            window.open(`${import.meta.env.VITE_SERVER_URL}/auth/google`, "_self");
        };
    
        const handleLinkedInLogin = () => {
            window.open(`${import.meta.env.VITE_SERVER_URL}/auth/linkedin`, "_self");
        };

    return (
        <div className="w-full flex-col-center space-y-6">
            <div className="pt-6 w-full flex-col-center select-none">
                <img
                    src="/logo-cloud-club-white.png"
                    alt="Logo"
                    className="w-[30%] sm:w-[40%] md:w-[25%] lg:w-[15%] h-auto"
                />
                <span className="text-white text-xl font-bold font-sans">HCMUTE</span>
            </div>
            
            <RegisterForm 
                formData={formData}
                error={error}
                successMsg={successMsg}
                isLoading={isLoading}
                onChange={handleChange}
                onSubmit={handleSubmit}
                onGoogleLogin={handleGoogleLogin}
                onLinkedInLogin={handleLinkedInLogin}
            />
        </div>
    );
};
