import { useKeycloak } from "@react-keycloak/web";
import axios, { AxiosInstance } from "axios";
import { useEffect, useState } from "react";

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
        //Authorization: initialized ? `Bearer ${keycloak.token}` : "",
        "Content-Type": "application/json;charset=UTF-8",
      },
    });

    setAxiosInstance({ instance });

    return () => {
      setAxiosInstance({});
    };
  }, [baseURL, initialized, keycloak, keycloak.token]);

  return {
    axios: (axiosInstance as any).instance as AxiosInstance,
    fetcher: (url: any) =>
      ((axiosInstance as any).instance as AxiosInstance)
        .get(url)
        .then((res) => res.data),
  };
};
