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
       
          console.log("Profile fetched success")
    
    

      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  return { user, setUser, isLoading };
};

export default useProfile;