import CaptchaBox from "./components/CaptchaBox"
import axios from "axios";

axios.defaults.withCredentials = true;
function App() {
 

  return (
    <>
    <CaptchaBox/>
    </>
  )
}

export default App
