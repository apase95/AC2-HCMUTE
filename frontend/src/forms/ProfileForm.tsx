import { BoxInputBase } from "../components/sub/BoxInputBase";
import { ButtonBase } from "../components/sub/ButtonBase";
import type { User } from "../Types";

interface ProfileFormProps {
    user: User;
    formData: any;
    loading: boolean;
    message: { text: string; type: 'success' | 'error' } | null;
    handleFormatPhoneNumber: (phone: string) => string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSave: () => void;
}

export const ProfileForm = ( props : ProfileFormProps) => {
    return (
        <div className="relative min-h-screen h-auto w-full grid-pattern">
            <div className="mx-auto mb-28 top-0 translate-y-24 w-[90%] lg:w-[60%] bg-white/5 border border-slate-400 rounded-lg">
                <div className="w-full py-2 md:py-12 flex flex-col md:flex-row">
                    
                    {/* Left Side */}
                    <div className="w-full md:w-1/3 mt-4 px-2 flex-center flex-col">
                        <img 
                            src={props.user.avatarURL || "/logo.jpg"} 
                            alt="avatar" 
                            className="w-[160px] h-[160px] object-cover rounded-full border-2 border-slate-300" 
                        />
                        <h2 className="text-2xl text-center font-bold mt-4 text-white">{props.user.displayName}</h2>
                        <p className="text-md text-center text-gray-300">{props.user.email}</p>
                        <p className="text-md text-center text-slate-100 font-semibold mt-1">
                            {props.formData.country || "Viet Nam"}
                        </p>
                        <img 
                            src={props.user.role=="admin" ? "/builder.png" : "/explorer.png"} 
                            alt="avatar" 
                            className="w-[240px] h-[240px] object-cover " 
                        />
                    </div>

                    <span className="hidden md:block w-[0.75px] h-auto bg-slate-400 mx-4"></span>

                    {/* Right Side */}
                    <div className="w-full md:w-2/3 px-6 md:px-12 flex flex-col space-y-4">
                        <h2 className="text-2xl font-bold mt-4 text-white">Edit your profile</h2>
                        
                        {props.message && (
                            <div className={`p-2 rounded text-sm font-semibold 
                                ${props.message.type === 'success' ? 'text-green-400' : 'text-red-400'}`}
                            >
                                {props.message.text}
                            </div>
                        )}

                        <div className="w-full flex flex-row space-x-4">
                            <BoxInputBase 
                                type="text" name="firstName" nameHolder="First Name"
                                placeholder="First Name" width="w-1/2"
                                value={props.formData.firstName} onChange={props.onChange}
                            />
                            <BoxInputBase 
                                type="text" name="lastName" nameHolder="Last Name"
                                placeholder="Last Name" width="w-1/2"
                                value={props.formData.lastName} onChange={props.onChange}
                            />
                        </div>

                        <BoxInputBase 
                            type="email" name="email" nameHolder="Email"
                            placeholder={props.user.email} width="w-full"
                            disabled={true}
                        />
                        <div className="w-full">
                            <BoxInputBase 
                                type="text" name="phoneNumber" nameHolder="Phone Number"
                                placeholder="**** *** ***" width="w-full"
                                value={props.handleFormatPhoneNumber(props.formData.phoneNumber)} 
                                disabled={true}
                            />
                            <p className="pl-2 text-xs text-gray-400 select-none">
                                To change phone number, go to Settings.
                            </p>
                        </div>
                        <BoxInputBase 
                            type="text" name="education" nameHolder="Education"
                            placeholder="University Name..." width="w-full"
                            value={props.formData.education} onChange={props.onChange}
                        />

                        <div className="w-full flex flex-row space-x-4">
                            <BoxInputBase 
                                type="text" name="country" nameHolder="Country"
                                placeholder="Vietnam" width="w-1/2"
                                value={props.formData.country} onChange={props.onChange}
                            />
                            <BoxInputBase 
                                type="text" name="province" nameHolder="Province"
                                placeholder="Ho Chi Minh" width="w-1/2"
                                value={props.formData.province} onChange={props.onChange}
                            />
                        </div>

                        <div className="w-full flex justify-end pt-4">
                            <ButtonBase
                                type="submit" 
                                onClick={props.onSave}
                                width="w-28"
                                name={props.loading ? "Saving..." : "Save"}
                                textColor="text-white"
                                bgColor="bg-secondary/80"
                                subClassName="hover:bg-secondary/40"
                                disabled={props.loading}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
