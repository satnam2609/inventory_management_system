import axios from "axios";

export const registerApi = async (userName, email, password) => {
  const res = await axios.post("http://localhost:3000/api/register", {
    userName,
    email,
    password,
  });

  return res.data;
};

export const currentUser = async (email) => {
  const res = await axios.post("http://localhost:3000/api/auth/current", {
    email,
  });

  return res.data.message;
};
