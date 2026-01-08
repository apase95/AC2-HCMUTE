import { useState } from "react";
import { BoxInputBase } from "../components/sub/BoxInputBase";
import { ButtonBase } from "../components/sub/ButtonBase";

interface SettingFormProps {
    onChangePassword: (data: any) => void;
    onChangePhone: (data: any) => void;
    loading: boolean;
    hasPhoneNumber: boolean;
    message: { text: string; type: 'success' | 'error' } | null;
}

export const SettingForm = ( props : SettingFormProps) => {
    const [phoneData, setPhoneData] = useState({ password: "", oldPhone: "", newPhone: "" });
    const [passData, setPassData] = useState({ phone: "", oldPass: "", newPass: "" });

    return (
        <div className="relative min-h-screen h-auto w-full grid-pattern pt-24 ">
            <div className="mx-auto w-[90%] lg:w-[50%] space-y-8 pb-12">
                
                <h1 className="text-3xl font-bold text-white mb-8 text-center">Account Settings</h1>

                {props.message && (
                    <div className={`p-3 rounded text-center font-semibold 
                        ${props.message.type === 'success' ? 
                        'bg-green-500/20 text-green-400' :
                        'bg-red-500/20 text-red-400'}`}
                    >
                        {props.message.text}
                    </div>
                )}

                <div className="w-full flex flex-col bg-white/5 py-8 px-12 rounded-xl border border-white/10">
                    <h2 className="text-xl text-white font-bold mb-4 border-b border-white/10 pb-2">
                        {props.hasPhoneNumber ? "Change Phone Number" : "Add Phone Number"}
                    </h2>
                    <div className="space-y-3">
                        <BoxInputBase 
                            type="password" nameHolder="Current Password" placeholder="Enter password to confirm" width="w-full"
                            value={phoneData.password} onChange={(e) => setPhoneData({...phoneData, password: e.target.value})}
                        />
                        {props.hasPhoneNumber && (
                            <BoxInputBase 
                                type="text" nameHolder="Old Phone Number" placeholder="Current phone number" width="w-full"
                                value={phoneData.oldPhone} onChange={(e) => setPhoneData({...phoneData, oldPhone: e.target.value})}
                            />
                        )}
                        <BoxInputBase 
                            type="text" nameHolder="New Phone Number" placeholder="New phone number" width="w-full"
                            value={phoneData.newPhone} onChange={(e) => setPhoneData({...phoneData, newPhone: e.target.value})}
                        />
                        <div className="flex justify-end pt-4">
                            <ButtonBase 
                                name="Update Phone" bgColor="bg-secondary/80" hoverBgColor="hover:bg-secondary/40" textColor="text-white" width="w-32"
                                onClick={() => props.onChangePhone(phoneData)} disabled={props.loading}
                            />
                        </div>
                    </div>
                </div>

                <div className={`w-full flex flex-col bg-white/5 py-8 px-12 rounded-xl border border-white/10 ${!props.hasPhoneNumber ? 'opacity-50 pointer-events-none' : ''}`}>
                    <h2 className="text-xl text-white font-bold mb-4 border-b border-white/10 pb-2">
                        <span>Add phone number first</span>
                    </h2>
                    <div className="flex flex-col space-y-3">
                        <BoxInputBase 
                            type="text" nameHolder="Phone Number" placeholder="Enter phone number to verify" width="w-full"
                            value={passData.phone} onChange={(e) => setPassData({...passData, phone: e.target.value})}
                        />
                        <BoxInputBase 
                            type="password" nameHolder="Old Password" placeholder="Current password" width="w-full"
                            value={passData.oldPass} onChange={(e) => setPassData({...passData, oldPass: e.target.value})}
                        />
                        <BoxInputBase 
                            type="password" nameHolder="New Password" placeholder="New password" width="w-full"
                            value={passData.newPass} onChange={(e) => setPassData({...passData, newPass: e.target.value})}
                        />
                        <div className="flex justify-end pt-4">
                            <ButtonBase 
                                name="Update Password" bgColor="bg-secondary/80" hoverBgColor="hover:bg-secondary/40" textColor="text-white" width="w-40"
                                onClick={() => props.onChangePassword(passData)} disabled={props.loading}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};