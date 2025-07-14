import { useState, useEffect } from "react";
import axios from "axios";

// Helper to get actions from localStorage
function getStoredActions(articleId) {
    const data = localStorage.getItem(`article-actions-${articleId}`);
    if (!data) return null;
    try {
        return JSON.parse(data);
    } catch {
        return null;
    }
}

// Helper to set actions in localStorage
function setStoredActions(articleId, actions) {
    localStorage.setItem(`article-actions-${articleId}`,
        JSON.stringify(actions)
    );
}

// Accept backend defaults for like, dislike, readLater
export const useArticleActions = (articleId, backendLikes, backendDislikes, backendReadLater) => {
    // If localStorage is not set, use backend values
    const [like, setLike] = useState(false);
    const [dislike, setDislike] = useState(false);
    const [readLater, setReadLater] = useState(false);

    useEffect(() => {
        const actions = getStoredActions(articleId);
        if (actions) {
            setLike(actions.like);
            setDislike(actions.dislike);
            setReadLater(actions.readLater);
        } else {
            setLike(backendLikes > 0);
            setDislike(backendDislikes > 0);
            setReadLater(!!backendReadLater);
        }
    }, [articleId, backendLikes, backendDislikes, backendReadLater]);

    const toggleLike = async () => {
        const newLike = !like;
        setLike(newLike);
        setStoredActions(articleId, { like: newLike, dislike, readLater });
        try {
            await axios.post(`http://localhost:4000/api/news/like/${articleId}`);
        } catch (err) {
            console.error('Failed to update like on backend', err);
        }
    };

    const toggleDislike = async () => {
        const newDislike = !dislike;
        setDislike(newDislike);
        setStoredActions(articleId, { like, dislike: newDislike, readLater });
        try {
            await axios.post(`http://localhost:4000/api/news/dislike/${articleId}`);
        } catch (err) {
            console.error('Failed to update dislike on backend', err);
        }
    };

    const toggleReadLater = async () => {
        const newReadLater = !readLater;
        setReadLater(newReadLater);
        setStoredActions(articleId, { like, dislike, readLater: newReadLater });
        try {
            await axios.post(`http://localhost:4000/api/news/readLater/${articleId}`);
        } catch (err) {
            console.error('Failed to update read later on backend', err);
        }
    };

    return {
        like,
        dislike,
        readLater,
        toggleLike,
        toggleDislike,
        toggleReadLater,
    };
};