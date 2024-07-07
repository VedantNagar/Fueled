import Lottie, { LottieRefCurrentProps } from "lottie-react";
import { useRef } from "react";
import start_animation from "../assets/Start/start_animation.json";
import { Link } from "react-router-dom";
import { CiLogin } from "react-icons/ci";
const HomePage = () => {
    const animationRef = useRef<LottieRefCurrentProps>(null);
    return (
        <div className="w-96 h-screen  mx-auto">
            <main className="relative justify-centeroverflow-hidden">
                <div className="w-full  mx-auto px-4 md:px-6 mt-24">
                    <div className="text-center">
                        <div className="font-extrabold text-3xl md:text-4xl [text-wrap:balance] bg-clip-text text-transparent bg-gradient-to-r from-slate-200/60 to-50% to-slate-200 ">
                            Now create your personalized events for{" "}
                            <span className="text-indigo-500 inline-flex flex-col h-[calc(theme(fontSize.3xl)*theme(lineHeight.tight))] md:h-[calc(theme(fontSize.4xl)*theme(lineHeight.tight))] overflow-hidden">
                                <ul className="block animate-text-slide-5 text-left leading-tight [&_li]:block ">
                                    <li>Birthdays</li>
                                    <li>Weddings</li>
                                    <li>Parties</li>
                                    <li>Ceremonies</li>
                                    <li>Functions</li>
                                    <li aria-hidden="true">And many more</li>
                                </ul>
                            </span>
                        </div>
                    </div>
                </div>
            </main>
            <Lottie lottieRef={animationRef} animationData={start_animation} />
            <Link
                className="flex gap-2 md:order-2 justify-center"
                to={"/login"}
            >
                <button className="text-white border rounded-md px-4 hover:scale-105 duration-150 font-normal py-2 flex items-center gap-1">
                    Login
                    <CiLogin className="text-2xl" />
                </button>
            </Link>
        </div>
    );
};
export default HomePage;
