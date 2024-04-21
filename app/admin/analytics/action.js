"use server";

import axios from "axios";

export async function getSalesByCategory(category) {
  const response = await axios.post(`http://localhost:3000/api/analytics`, {
    id: category,
  });

  return response.data.resultArray;
}

// export const getValuesForCategory = async (slug) => {
//   const response = await fetch(
//     "http://localhost:3000/api/categories/" + "electronics",
//     {
//       method: "POST",
//       headers: {
//         "Content-type": "application/json",
//       },
//       body: JSON.stringify({ startDate: "", endDate: "" }),
//     }
//   );

//   if (response.ok) {
//     const { message } = await response.json();
//     return message;
//   }
// };
