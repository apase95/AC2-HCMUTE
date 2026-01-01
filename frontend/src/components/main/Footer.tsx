import { IconSubscription } from "../sub/IconSubscription";
import { GiPositionMarker } from "react-icons/gi";
import { LogoTitleComponent } from "../sub/LogoTitleComponent";
import { FaFacebook, FaLinkedin } from "react-icons/fa6";
import { IoIosMail } from "react-icons/io";

export const Footer = () => {
    return (
        <>
            <div className="w-full p-[2px] animated-rgb-border"></div>
            <div className="w-full bg-neutral-950 flex justify-center">
                <div className="w-4/5 py-8 flex flex-col justify-center items-center space-y-2">
                    <LogoTitleComponent
                        title="AC2 HCMUTE"
                        subtitle="AWS Cloud Club HCMUTE"
                        width="w-full"
                        height="h-20"
                        subClassName="justify-center mb-2"
                    />
                    <IconSubscription
                        icon={<GiPositionMarker />}
                        title="No.1 Vo Van Ngan Street, Thu Duc Ward, Ho Chi Minh City, Vietnam"
                    />
                    <IconSubscription
                        icon={<IoIosMail />}
                        title="awscloudclub.hcmute@gmail.com"
                        href="https://mail.google.com/mail/u/0/#inbox"
                    />
                    <IconSubscription
                        icon={<FaFacebook />}
                        title="AWS Cloud Club Ho Chi Minh City University of Technology and Education"
                        href="https://www.facebook.com/AWSCloudClubHCMUTE"
                    />
                    <IconSubscription
                        icon={<FaLinkedin />}
                        title="AWS CLOUD CLUB HCMUTE"
                        href="https://www.linkedin.com/company/aws-cloud-club-hcmute"
                    />
                </div>
            </div>
        </>
    );
};
