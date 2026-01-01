import { useState } from "react";
import { SettingForm } from "../forms/SettingForm";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store";
import { changePhoneNumber, changePassword } from "../redux/authSlice";

export const SettingPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { user, isLoading } = useSelector((state: RootState) => state.auth);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    const hasPhoneNumber = !!(user && user.phoneNumber && user.phoneNumber.trim() !== "");

    const handleChangePhone = async (data: any) => {
        setMessage(null);
        const resultAction = await dispatch(changePhoneNumber(data));
        if (changePhoneNumber.fulfilled.match(resultAction)) {
            setMessage({ text: "Phone number updated successfully!", type: "success" });
        } else {
            setMessage({ text: resultAction.payload as string, type: "error" });
        }
    };

    const handleChangePassword = async (data: any) => {
        setMessage(null);
        const resultAction = await dispatch(changePassword(data));

        if (changePassword.fulfilled.match(resultAction)) {
            setMessage({ text: "Password updated successfully!", type: "success" });
        } else {
            setMessage({ text: resultAction.payload as string, type: "error" });
        }
    };

    return (
        <SettingForm 
            onChangePhone={handleChangePhone}
            onChangePassword={handleChangePassword}
            loading={isLoading}
            hasPhoneNumber={hasPhoneNumber}
            message={message}
        />
    );
};