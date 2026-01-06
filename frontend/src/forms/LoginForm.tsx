import { Link } from "react-router-dom";
import { BoxInputLogin } from "../components/sub/BoxInputLogin";
import { ButtonBase } from "../components/sub/ButtonBase";
import { ButtonBrand } from "../components/sub/ButtonBrand";
import { ErrorComponent } from "../components/sub/ErrorComponent";

interface LoginFormProps {
    formData?: { email: string; password: string };
    isLoading?: boolean;
    error?: string | null;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
    onGoogleLogin: () => void;
    onLinkedInLogin: () => void;
};

export const LoginForm = ( props : LoginFormProps) => {

    return (
        <div className="w-full h-[calc(100vh-60px)] relative">
            
            <form
                onSubmit={props.onSubmit}
                className={`absolute-center-x top-1/3 -translate-y-1/2 w-[90%] lg:w-[35%] sm:w-[90%] md:w-[70%] pb-12 ${props.error ? "pt-0" : "pt-12"} flex-col-center space-y-4 bg-primary/40 rounded-xl`}
            >
                {props.error && <ErrorComponent error={props.error} inBlock={true} subClassName="!pt-12 px-8 md:px-12" />}
                
                <BoxInputLogin 
                    type="email" 
                    name="email" 
                    placeholder="Username or email" 
                    width="w-4/5" 
                    value={props.formData?.email || ""}
                    onChange={props.onChange}
                />
                <BoxInputLogin 
                    type="password" 
                    name="password" 
                    placeholder="Password" 
                    width="w-4/5" 
                    value={props.formData?.password || ""}
                    onChange={props.onChange}
                />
                <div className="w-4/5 flex-between flex-row">
                    <div className="flex-center">
                        <input
                            type="radio"
                            id="rememberMe"
                            name="rememberMe"
                            className="w-4 h-4 accent-black" 
                        />
                        <label 
                            htmlFor="rememberMe"
                            className="ml-2 text-white"
                        >
                            Remember me
                        </label>
                    </div>
                    <Link 
                        to="/forgot-password"
                        className="text-italic"
                    >
                        Forgot password?
                    </Link>
                </div>
                <ButtonBase 
                    type="submit"
                    name={props.isLoading ? "Signing In..." : "Sign In"} 
                    width="w-4/5"
                    textColor="text-black"
                    bgColor="bg-white"
                    hoverBgColor="hover:bg-white/70"
                />
                <div className="w-4/5 pt-5 flex-center flex-row gap-2">
                    <div className="text-white">Don't have an account?</div>
                    <Link to="/register" className="text-italic">
                        Sign Up
                    </Link>
                </div>

                <div className="w-4/5 flex-center flex-row space-x-2">
                    <ButtonBrand
                        name="Google"
                        width="w-full"
                        textColor="text-black"
                        bgColor="bg-white"
                        hoverBgColor="hover:bg-gray-300"
                        subClassName="border border-transparent"
                        onClick={props.onGoogleLogin}
                    />
                    <ButtonBrand
                        name="Linked In"
                        width="w-full"
                        textColor="text-white"
                        bgColor="bg-blue-800"
                        hoverBgColor="hover:bg-blue-900"
                        subClassName="border border-transparent"
                        onClick={props.onLinkedInLogin}
                    />
                </div>
            </form>
        </div>
    );
};
