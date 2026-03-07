const YOUR_UPLOAD_PRESET = "vivuviet";
const YOUR_CLOUD_NAME = "vinhhv28";
export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", YOUR_UPLOAD_PRESET);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${YOUR_CLOUD_NAME}/image/upload`,
      { method: "POST", body: formData },
    );
    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
};
