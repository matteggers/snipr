import { useState, useEffect } from 'react';
import axios from 'axios';

export const useArticles = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/news/');
                const result = response.data;
                console.log('Full API response:', result);
                console.log('result.data:', result.data);
                console.log('result.data type:', typeof result.data);
                console.log('Is result.data an array?', Array.isArray(result.data));
                console.log('result.data keys:', Object.keys(result.data));
                console.log('result.data.articles:', result.data.articles);
                // result.data is now an array of database articles, not an object
                setArticles(result.data || []);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    return { articles, loading, error };
}