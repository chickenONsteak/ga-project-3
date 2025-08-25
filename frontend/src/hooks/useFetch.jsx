import React from "react";

const useFetch = () => {
  try {
    const fetchData = async (endpoint, method, body, token) => {
      const res = await fetch(import.meta.env.VITE_SERVER + endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) {
        if (Array.isArray(data.msg)) {
          const errorMessages = data.msg.map((item, idx) => {
            return <p key={idx}>{item.msg}</p>;
          });
          return { ok: false, message: errorMessages };
        } else {
          return { ok: false, message: data.msg };
        }
      } else {
        return { ok: true, data };
      }
    };

    return fetchData;
  } catch (error) {
    console.error(error.message);
    return { ok: false, message: "data error" };
  }
};

export default useFetch;
