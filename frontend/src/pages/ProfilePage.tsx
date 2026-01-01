import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkAuth, updateUser } from "../redux/authSlice";
import { ProfileForm } from "../forms/ProfileForm";
import { LoadingSpinner } from "../components/sub/LoadingSpinner";
import { ErrorComponent } from "../components/sub/ErrorComponent";

export const ProfilePage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    
    const { user, isLoading, isAuthenticated, error } = useSelector((state: RootState) => state.auth);
    const [ message, setMessage ] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        education: "",
        country: "",
        province: "",
    });

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            navigate("/login");
        }
    }, [isLoading, isAuthenticated, navigate]);

    useEffect(() => {
        if (isAuthenticated && !user && !isLoading) {
            dispatch(checkAuth());
        }
    }, [isAuthenticated, user, isLoading, dispatch]);

    useEffect(() => {
        if (user) {
            const nameParts = user.displayName ? user.displayName.split(" ") : ["", ""];
            setFormData({
                firstName: user.firstName || nameParts[0] || "",
                lastName: user.lastName || nameParts.slice(1).join(" ") || "",
                phoneNumber: user.phoneNumber || "",
                education: user.education || "",
                country: user.country || "",
                province: user.province || "",
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSave = async () => {
        setMessage(null);
        const resultAction = await dispatch(updateUser(formData));
        if (updateUser.fulfilled.match(resultAction)) {
            setMessage({ text: "Profile updated successfully!", type: "success" });
        } else {
            setMessage({ text: "Failed to update profile. Please try again.", type: "error" });
        }
    };

    const formatPhoneNumber = (phone: string) => {
    if (!phone) return "";
    if (phone.length <= 3) return phone;
    return "*".repeat(phone.length - 3) + phone.slice(-3);
};

    if (isLoading) return <LoadingSpinner />;    
    if (error) return <ErrorComponent error={error} inBlock={false} />;
    if (!user) return null;

    return (
        <ProfileForm 
            user={user}
            formData={formData}
            loading={isLoading}
            message={message}
            handleFormatPhoneNumber={formatPhoneNumber}
            onChange={handleChange}
            onSave={handleSave}
        />
    )
}

