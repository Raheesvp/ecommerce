import api from "../Api/AxiosInstance";

export const userService ={

getProfile :async ()=>{
    const response =  await api.get("/Users/profile");
    return response.data;
},

  updateProfile :async (userData)=>{
        const formData = new FormData();

        formData.append("FirstName",userData.firstName);
        formData.append("LastName",userData.lastName);
        formData.append("MobileNumber",userData.mobileNumber ||userData.phoneNumber);

        if(userData.profileImageFile){
          formData.append("ProfileImage",userData.profileImageFile);
        }

        const response = await api.put("/Users/profile-update",formData,{
          headers :{
            "Content-Type" : "multipart/form-data",
          },
        });
        return response.data;
  },




}