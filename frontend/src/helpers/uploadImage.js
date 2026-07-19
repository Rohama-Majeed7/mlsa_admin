import axios from "axios";

const uploadImage = async (file) => {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", "mlsa_events_teams");

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData
    );

    return response.data.secure_url;
  } catch (error) {
    console.error(error);
  }
};

export default uploadImage;