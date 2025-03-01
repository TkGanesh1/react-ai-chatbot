import styles from "./Loader.module.css";
import Lottie from "lottie-react";
import loaderAnimation from "./Loader.json";

export function Loader() {
    return (
        <div className={styles.LoaderWrapper}>
            {/* Background Blur Matching Loader Shape */}
            <div className={styles.LoaderBackgroundBlur} />
            
            {/* Lottie Animation */}
            <Lottie animationData={loaderAnimation} className={styles.LottieLoader} />
        </div>
    );
}
