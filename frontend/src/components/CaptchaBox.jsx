import { useEffect, useState } from "react";
import axios from "axios";
import { IoIosArrowForward } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { FaCheck } from "react-icons/fa";

const CaptchaBox = () => {
  const [captcha, setCaptcha] = useState("");
  const [userInput, setUserInput] = useState("");
  const [right, setRight] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [skip, setSkip] = useState(0);
  const [time, setTime] = useState(15);

  const fetchCaptcha = async () => {
    try {
      const { data } = await axios.get("http://localhost:4000/captcha");
      setCaptcha(data.captchaImage);
      setTime(15);
    } catch (error) {
      console.error("Failed to fetch captcha:", error);
    }
  };

  const submitCaptcha = async () => {
    if (!userInput) {
      alert("Captcha input is empty");
      return;
    }

    try {
      const { data } = await axios.post("http://localhost:4000/val-captcha", {
        answer: userInput,
      });
      setRight(data.right);
      setWrong(data.wrong);
      setSkip(data.skips);
      fetchCaptcha();
      setUserInput("");
    } catch (error) {
      console.error("Error during captcha submission:", error);
      setWrong((prev) => prev + 1);
      fetchCaptcha();
      setUserInput("");
    }
  };

  const skipCaptcha = async () => {
    try {
      const { data } = await axios.post("http://localhost:4000/skip");
      
      setRight(data.right);
      setWrong(data.wrong);
      setSkip(data.skip);
      fetchCaptcha();
      setUserInput("");
    } catch (error) {
      console.error("Failed to skip captcha:", error);
    }
  };

  useEffect(() => {
    fetchCaptcha();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    if (time === 0) skipCaptcha();

    return () => clearInterval(interval);
  }, [time]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-8 lg:px-16">
  <div className="w-full max-w-md md:max-w-lg bg-white shadow-lg rounded-lg p-6 space-y-4 relative">
    {/* CAPTCHA Image */}
    <div className="flex justify-center">
      <img
        src={captcha}
        alt="CAPTCHA"
        className="w-[80%] md:w-[60%] object-cover h-20  border rounded-lg"
      />
    </div>

    {/* Timer */}
    <div className="absolute top-24 right-4 bg-black text-white text-xs sm:text-sm font-bold px-3 py-1 rounded-full">
      {time}s
    </div>

    {/* Instruction */}
    <p className="text-pink-500 text-start text-xs sm:text-sm font-medium">
      Special Alpha Numeric Case Sensitive
    </p>

    {/* Input and Skip Button */}
    <div className="relative flex items-center">
      <input
        type="text"
        placeholder="Enter Captcha"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        className="w-full border border-gray-300 rounded-full p-2 sm:p-3 text-xs sm:text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={skipCaptcha}
        className="absolute right-2 bg-black p-1 text-white px-8 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-medium shadow hover:bg-gray-800"
      >
        Skip
      </button>
    </div>

    {/* Submit Button and Refer Section */}
    <div className="flex justify-between items-center space-x-4">
      <div className="flex-grow flex justify-center">
        <button
          onClick={submitCaptcha}
          className="bg-blue-800 text-white w-24 sm:w-32 py-2 rounded-full font-bold uppercase shadow hover:bg-blue-900 focus:outline-none"
        >
          Submit
        </button>
      </div>

      <div className="w-12 sm:w-16 h-12 sm:h-16 flex items-center justify-center bg-black text-white text-xs sm:text-base font-semibold rounded-full shadow-md cursor-pointer hover:bg-gray-800">
        Refer & <br /> Earn
      </div>
    </div>

    {/* Skip, Wrong, Correct Indicators */}
    <div className="flex flex-wrap items-center justify-around space-y-4 sm:space-y-0 space-x-2">
      <div className="flex items-center space-x-2 border border-gray-300 bg-white shadow-md rounded-full px-4 py-2">
        <IoIosArrowForward className="text-blue-500 text-lg" />
        <p className="text-xs sm:text-sm font-bold text-gray-700">{skip}</p>
      </div>

      <div className="flex items-center space-x-2 border border-gray-300 bg-white shadow-md rounded-full px-4 py-2">
        <RxCross2 className="text-red-500 text-lg" />
        <p className="text-xs sm:text-sm font-bold text-gray-700">{wrong}</p>
      </div>

      <div className="flex items-center space-x-2 border border-gray-300 bg-white shadow-md rounded-full px-4 py-2">
        <FaCheck className="text-green-500 text-lg" />
        <p className="text-xs sm:text-sm font-bold text-gray-700">{right}</p>
      </div>
    </div>

    {/* Footer Instructions */}
    <div className="text-xs text-gray-500 space-y-1">
      <p>* All words are case sensitive.</p>
      <p>* Calculative captchas must be solved.</p>
      <p>* Captcha length: 6 to 12 characters.</p>
      <p>* Result can include negative numbers (e.g., 5 - 8 = -3).</p>
    </div>
  </div>
</div>

  );
};

export default CaptchaBox;
