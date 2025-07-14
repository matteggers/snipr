export const SectionTitle = (props) => {
    const colorMap = {
        'Disliked': 'text-red-600',
        'Liked': 'text-green-600',
        'Today': 'text-blue-600',
        'Home': 'text-gray-600',
        'Read Later': 'text-orange-500',
        'default': 'text-gray-800'
    };
    
    const textColorClass = colorMap[props.name] || colorMap['default'];

    return (
        <div className="my-4">
            <h1 className={`text-4xl font-bold ${textColorClass}`}>{props.name}</h1>
        </div>
    );
}
