"use client";

import React, { useEffect, useState } from "react";
import Spline from "@splinetool/react-spline";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
// import EnhancedBackground3D from "./EnhancedBackground3D";

const Hero: React.FC = () => {
  const [showWelcome, setShowWelcome] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-screen overflow-hidden relative">
      {/* Enhanced 3D Background */}
      {/* <EnhancedBackground3D /> */}

      {/* Spline 3D Object - Positioned to the right */}
      <div className="absolute inset-0 w-full h-full translate-x-12 z-20">
        <Spline scene="https://prod.spline.design/XJ51iL5MvHcv9ecJ/scene.splinecode" />
      </div>

      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-black z-10" />

      {/* Navbar */}
      <nav className="absolute top-0 right-0 p-4 z-30">
        <Button
          variant="outline"
          className="text-blue border-white hover:bg-white hover:text-black transition-colors duration-300 ease-in-out transform hover:scale-105"
          onClick={() => navigate("/login")}
        >
          Gov Login
        </Button>
      </nav>

      {/* Welcome Text */}
      <motion.div
        className="absolute left-1/2 top-1/3 transform -translate-x-1/2 -translate-y-1/2 text-center z-30"
        initial={{ opacity: 0, y: 50 }}
        animate={showWelcome ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.h1
          className="text-6xl font-bold text-white mb-8 tracking-wider"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Welcome to TraceVera
        </motion.h1>
        <motion.p
          className="text-xl text-white mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          Experience the future of project tracking and citizen engagement
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          <Button
            variant="default"
            size="lg"
            className="text-lg px-8 py-6 bg-white text-black hover:bg-black hover:text-white transition-colors duration-300 ease-in-out transform hover:scale-105"
            onClick={() => navigate("/citizenHome")}
          >
            Citizen Login
          </Button>
        </motion.div>
      </motion.div>

      {/* Floating Elements */}
      <motion.div
        className="absolute bottom-10 left-10 text-white text-opacity-80 z-30"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <p className="text-sm">Powered by blockchain technology</p>
      </motion.div>

      <motion.div
        className="absolute bottom-10 right-10 text-white text-opacity-80 z-30"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <p className="text-sm">Ensuring transparency and accountability</p>
      </motion.div>
    </div>
  );
};

export default Hero;
