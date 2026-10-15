import { motion } from "framer-motion";

const LoadingSpinner = () => {
  return (
    <div className="loader-container">
      <motion.div
        animate={{
          rotate: 360,
          borderRadius: ["20%", "50%", "20%"],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="loader-orb"
      />
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "mirror" }}
        className="loader-text"
      >
        Loading your health portal...
      </motion.p>
    </div>
  );
};

export default LoadingSpinner;
