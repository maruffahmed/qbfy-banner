import axios from 'axios';
import { useAppBridge } from '@shopify/app-bridge-react';
import { getSessionToken } from '@shopify/app-bridge-utils';

const useAxios = () => {
    const app = useAppBridge();
    const instance = axios.create();
    instance.interceptors.request.use( async config => {
        const token = await getSessionToken(app);
        config.headers['Authorization'] = `Bearer ${token}`;
        return config;
    })
    return [instance];
}

export default useAxios;