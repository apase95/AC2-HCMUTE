import { useDispatch, useSelector } from "react-redux";
import { LoginForm } from "../forms/LoginForm";
import type { AppDispatch, RootState } from "../redux/store";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { checkAuth, clearError, loginUser } from "../redux/authSlice";

export const LoginPage = () => {

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const location = useLocation();

    const { isLoading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);
    const [ formData, setFormData ] =  useState<{ email: string; password: string }>
        ({
            email: "",
            password: ""
        });

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const accessToken = params.get("accessToken");
        if (accessToken) {
            localStorage.setItem("accessToken", accessToken);
            window.history.replaceState({}, document.title, "/");
            dispatch(checkAuth());
        }
    }, [location, dispatch]);

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/");
        } 
        return () => { dispatch(clearError()) }
    }, [isAuthenticated, navigate, dispatch]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(loginUser({ email: formData.email, password: formData.password }));
    }

    const handleGoogleLogin = () => {
        window.open(`${import.meta.env.VITE_SERVER_URL}/auth/google`, "_self");
    };

    const handleLinkedInLogin = () => {
        window.open(`${import.meta.env.VITE_SERVER_URL}/auth/linkedin`, "_self");
    };
    
    return (
        <div className="w-full flex-col-center space-y-6">
            <div className="pt-6 w-full flex-col-center">
                <img 
                    src="/logo-cloud-club-white.png"
                    alt="Logo"
                    className="w-[30%] sm:w-[40%] md:w-[25%] lg:w-[15%] h-auto" />
                <span className="text-white text-xl font-bold font-sans">HCMUTE</span>
            </div>

            <LoginForm 
                formData={formData}
                isLoading={isLoading}
                error={error}
                onChange={handleChange}
                onSubmit={handleSubmit}
                onGoogleLogin={handleGoogleLogin}
                onLinkedInLogin={handleLinkedInLogin}
            />
        </div>
    );
};
