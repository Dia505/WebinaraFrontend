import { useNavigate } from "react-router-dom";

import "../css_files/home/category_grid.css"
import CategoryCard from "./category_card";

function CategoryGrid() {
    const navigate = useNavigate();

    const handleCategoryClick = (category) => {
        navigate(`/search?category=${encodeURIComponent(category)}`);
    };

    return(
        <> 
            <div className="category-grid">
                <CategoryCard category="Business" onClick={handleCategoryClick}/>
                <CategoryCard category="Technology" onClick={handleCategoryClick}/>
                <CategoryCard category="Design" onClick={handleCategoryClick}/>
                <CategoryCard category="Health" onClick={handleCategoryClick}/>
                <CategoryCard category="Education" onClick={handleCategoryClick}/>
                <CategoryCard category="Career" onClick={handleCategoryClick}/>
                <CategoryCard category="Finance" onClick={handleCategoryClick}/>
                <CategoryCard category="Marketing" onClick={handleCategoryClick}/>
                <CategoryCard category="Lifestyle" onClick={handleCategoryClick}/>
                <CategoryCard category="Creative" onClick={handleCategoryClick}/>
            </div>
        </>
    )
}

export default CategoryGrid;