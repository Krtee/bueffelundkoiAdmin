import { useKeycloak } from "@react-keycloak/web";
import { useState, useEffect } from "react";
import axios, { AxiosInstance } from "axios";

/**
 * Creates a prefconfigured axios wrapper that also talks with
 * the keycloak instance.
 */
export const useAxios = () => {
  const { keycloak, initialized } = useKeycloak();
  const [axiosInstance, setAxiosInstance] = useState({});
  const baseURL = process.env.REACT_APP_SERVICE_URL;

  useEffect(() => {
    const instance = axios.create({
      baseURL,
      headers: {
        Authorization: initialized ? `Bearer ${keycloak.token}` : undefined,
        "Content-Type": "application/json;charset=UTF-8",
      },
    });

    setAxiosInstance({ instance });

    return () => {
      setAxiosInstance({});
    };
  }, [baseURL, initialized, keycloak, keycloak.token]);

  return (axiosInstance as any).instance as AxiosInstance;
};
