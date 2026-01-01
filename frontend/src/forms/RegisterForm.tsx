import { BoxInputLogin } from "../components/sub/BoxInputLogin";
import { Link } from "react-router-dom";
import { ButtonBase } from "../components/sub/ButtonBase";
import { ButtonBrand } from "../components/sub/ButtonBrand";
import { ErrorComponent } from "../components/sub/ErrorComponent";
import { SuccessComponent } from "../components/sub/SuccessComponent";

interface RegisterFormProps {
    formData?: { fullname: string, email: string; password: string };
    successMsg?: string;
    isLoading?: boolean;
    error?: string | null;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
    onGoogleLogin: () => void;
    onLinkedInLogin: () => void;
};

export const RegisterForm = (props: RegisterFormProps) => {
    

    return (
        <div className="w-full h-[calc(100vh-60px)] relative">
            <form
                onSubmit={props.onSubmit}
                className="absolute-center-x top-1/3 -translate-y-1/2 w-[90%] lg:w-[35%] sm:w-[90%] md:w-[70%] py-6 md:py-12 lg:py-12 flex-col-center space-y-4 bg-primary/40 rounded-xl"
            >
                {props.error && <ErrorComponent error={props.error} inBlock={true} subClassName="pt-0 px-8 md:px-12" />}
                {props.successMsg && <SuccessComponent error={props.successMsg} inBlock={true} subClassName="pt-0 px-8 md:px-12" />}                
                <BoxInputLogin
                    type="text"
                    name="fullname"
                    placeholder="Full Name"
                    width="w-4/5"
                    value={props.formData?.fullname || ""}
                    onChange={props.onChange}
                />
                <BoxInputLogin
                    type="email"
                    name="email"
                    placeholder="Email"
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

                <div className="w-4/5 mt-2">
                    <ButtonBase
                        type="submit"
                        name={props.isLoading ? "Loading..." : "Sign Up"}
                        width="w-full"
                        textColor="text-black"
                        bgColor="bg-white"
                        hoverBgColor="hover:bg-white/70"
                        disabled={props.isLoading}
                    />
                </div>

                <div className="w-4/5 pt-5 flex-center flex-row gap-2">
                    <div className="text-white">Already have an account?</div>
                    <Link to="/login" className="text-italic">
                        Sign In
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
