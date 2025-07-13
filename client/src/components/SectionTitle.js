import '../styles/components/SectionTitle.css';

export const SectionTitle = (props) => {

    let textColor;

    switch (props.name) {
        case 'Disliked':
            textColor='red';
            break;
        case 'Liked':
            textColor='green';
            break;
        case 'Today':
            textColor='blue';
            break;
        case 'Home':
            textColor='grey';
            break;
        case 'Read Later':
            textColor='orange';
            break;
    }


    return (
        <div className="header">
            <h1 className="title" style={{color: textColor}}>{props.name}</h1>
            <h3></h3>
        </div>
    );
}

// conditional rendering for color

