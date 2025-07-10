import "../css_files/home/category_card.css";

function CategoryCard({ onClick, category }) {
    return (
        <>
            <div className="category-card" onClick={() => onClick(category)}>
                <p className="category-title">{category}</p>
            </div>
        </>
    )
}

export default CategoryCard;