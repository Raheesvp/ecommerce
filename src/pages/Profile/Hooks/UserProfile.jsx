import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../../Api/AxiosInstance";
import { userService } from "../../../Services/UserService";

export const useProfile = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      console.log("Starting profile")
      try {
        const res = await userService.getProfile();
        console.log("Success api response ",res);
        setUser(res);
      } catch(error) {
        toast.error("Session expired");
        console.log("Error",error);

        if (error.config) {
        console.log("❌ I tried to visit this URL:", error.config.url);
        console.log("❌ Base URL was:", error.config.baseURL);
    }
        navigate("/login");
        console.log()
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  return { user, setUser, isLoading };
};

export default useProfile;