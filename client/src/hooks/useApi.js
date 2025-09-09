import { useState, useEffect } from "react";
import api from '../utils/api';

const useApi = (url, options = {}) => {
    const [data,setData] = useState(null);
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState(null);

    const fetchData = async () => {
        try{
            setLoading(true);
            const response = await api(url,options);
            setData(response.data);
            setError(null);
        }
        catch (err) {
            setError(err.response?.data || err.message);
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if(url) {
            fetchData();
        }
    }, [url]);

    return { data, loading, error, refetch: fetchData };

};


export default useApi;