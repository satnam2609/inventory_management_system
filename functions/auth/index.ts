import axios from "axios";
import { BASE } from "@/functions/index";

export async function registerApi(
  name: string,
  email: string,
  password: string
): Promise<any> {
  const res = await axios.post(`${BASE}/api/user`, {
    name,
    email,
    password,
  });

  return res;
}
