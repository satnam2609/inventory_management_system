import axios from "axios";

export async function registerApi(
  name: string,
  email: string,
  password: string
): Promise<any> {
  const res = await axios.post(`/api/user`, {
    name,
    email,
    password,
  });

  return res;
}
