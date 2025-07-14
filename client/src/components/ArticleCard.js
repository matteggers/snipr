import { useArticleActions } from '../hooks/useArticleActions';

export const ArticleCard = (props) => {
    // Use backend values as fallback if localStorage is not set
    const { like, dislike, readLater, toggleLike, toggleDislike, toggleReadLater } = useArticleActions(props.id, props.likes, props.dislikes, props.read_later);
    return (
        <div className="card w-full bg-stone-50 shadow-xl border border-black/10 rounded-md flex flex-col p-2">
            <div className="card-body flex-grow">
                <h2 className="card-title text-lg font-bold leading-tight">
                    {props.title}
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                    {props.description}
                </p>
                <div className="flex space-x-4 mt-2">
                    <span className="text-green-700 text-xs">Likes: {props.likes}</span>
                    <span className="text-red-700 text-xs">Dislikes: {props.dislikes}</span>
                    {props.read_later && <span className="text-orange-700 text-xs">Read Later</span>}
                </div>
            </div>
            <div className="card-actions justify-end p-4 pt-0">
                <div className="space-x-2">
                    <button className={`btn btn-soft btn-success ${like ? 'opacity-100' : 'opacity-50'}`} onClick={toggleLike}>Like</button>
                    <button className={`btn btn-sm btn-error ${dislike ? 'opacity-100' : 'opacity-50'}`} onClick={toggleDislike}>Dislike</button>
                    <button className={`btn btn-sm btn-info ${readLater ? 'opacity-100' : 'opacity-50'}`} onClick={toggleReadLater}>Read Later</button>
                </div>
            </div>
        </div>
    );
}