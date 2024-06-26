import React, { useState, useEffect } from 'react';
import { useNavigate} from 'react-router-dom';
import RenderListItem from './renderListItem';
import Button from 'react-bootstrap/Button';
import { FaPlus } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import Loading from "./loading";
import localStore from '../utilities/localStorage';
import dataServices from '../utilities/apiServices/dataServices';

const MyRecipes = ({ handleAddToFavorites, handleRemoveFromFavorites }) => {
    const [recipes, setRecipes] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchRecipes = async () => {
        const jwt = localStore.getJwt();
        try {
            setLoading(true);
            if (jwt) {
                const {data, error} = await dataServices.getRecipes(`api/recipes/myrecipes`, jwt);
                if (error) {
                    throw Error(error);
                }
                setRecipes(data);
                setLoading(false);
            } else {
                throw Error(`Access restricted! Please sign up..`)
            }
        } catch (err) {
            setLoading(false);
            console.error("Error retrieving recipes:", err);
            setError(err.message);
        }
    }

    useEffect(() => {
        fetchRecipes();
    },[]);
    
    const handleDelete = async (id) => {
        let text = `
        Warning! 
        This action this irreversible!.
        Are you sure you want to delete this recipe?`

        if (confirm(text) == true) {
            try {
                const jwt = localStore.getJwt();
                const {data, error} = await dataServices.deleteRecipe(`api/recipes/myrecipes/${id}`, jwt);
                if (error) {
                    throw error;
                }
                const filteredRecipes = recipes.filter(recipe => recipe.id !== id);
                setRecipes(filteredRecipes);
            } catch (err) {
                console.error('Error deleting a recipe with id of ' + id, err);
                setError(err.message);
            }
        } else {
           return;
        }
    };

    const handleEdit = async (id) => {
        navigate(`/edit-recipe/${id}`);
    }
    if (isLoading) {
        return <Loading />;
    } else
        if (error) {
            return <h2 className="m-auto text-danger">{error}</h2>
        } else {
            return (
                <div className="h-100 pt-5 overflow-scroll">
                    <div className="d-flex justify-content-between">
                        <Button variant="success" onClick={() => { navigate('/'); location.reload(); }}>
                            <IoIosArrowBack />
                        </Button>
                        <Button variant="success" onClick={() => { navigate('/add-recipe') }}>
                            Add Recipe&nbsp;
                            <FaPlus />
                        </Button>
                    </div>
                    {recipes.map((recipe, i) => (
                        <RenderListItem key={i} item={recipe} isFavorite={recipe.favorite} deleteItem={handleDelete} addToFavorites={handleAddToFavorites} removeFromFavorites={handleRemoveFromFavorites} handleEdit={() => handleEdit(recipe.id)} />
                    )
                    )}
                </div>)
        }
};

export default MyRecipes;