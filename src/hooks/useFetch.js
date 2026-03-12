import { useEffect, useState } from "react";
import axios from "axios";

const useFetch = (url) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await axios.get(url);
            setData(res.data.data || res.data);
            setError(null);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (url) {
            fetchData();
        }
    }, [url]);

    const reFetchData = () => {
        fetchData();
    };

    return { data, loading, error, reFetchData };
};

export default useFetch;
