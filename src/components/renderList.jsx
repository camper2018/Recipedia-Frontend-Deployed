import data from '../data';
import React, { useState, useEffect } from 'react';
import styles from './renderList.module.css';
import RenderListItem from './renderListItem';
import Button from 'react-bootstrap/Button';
import  {numericQuantity } from 'numeric-quantity';
import {getUnitSystemForWet} from '../utilities/addWetIngredients';
import {getUnitSystemForDry} from '../utilities/addDryIngredients';
import { addDryIngredients } from '../utilities/addDryIngredients';
import { addWetIngredients } from '../utilities/addWetIngredients';
import { convertCustomaryToMetric } from '../utilities/convertUnitSystem';
import { convertMetricToCustomary } from '../utilities/convertUnitSystem';
import { findUnitSystem } from '../utilities/convertUnitSystem';
import GroceryList from './renderGroceryList.jsx';
const DisplayList = () => {

    const [recipes, setRecipes] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [groceries, setGroceries] = useState({});
    const [unitSystem, setUnitSystem] = useState('customary');
    const [currentComponent, setComponent] = useState(false);
    useEffect(() => {
        const convertUnitSystem = unitSystem === 'customary'? convertMetricToCustomary: convertCustomaryToMetric;
        const dataInOneUnitSystem = data.map(recipe => {
          if (findUnitSystem(recipe) !==  unitSystem) {
            recipe.ingredients = convertUnitSystem(recipe.ingredients);
          }
            return recipe;
        })
        setRecipes(dataInOneUnitSystem);
        setFavorites(recipes.filter(item => item.favorite));
    }, [unitSystem, data]);

    const handleDeleteRecipes = (id) => {
        let filteredRecipes = recipes.filter(recipe => recipe.id !== id);
        setRecipes(filteredRecipes);
    };
    const handleAddToFavorites = (recipe) => {
        recipe.favorite = true;
        setFavorites([...favorites, recipe]);
    };
    const handleRemoveFromFavorites = (recipe) => {
        recipe.favorite = false;
        setFavorites([...favorites, recipe])
    };
    
    const createIngredientsList = ()=> {
            
        // extract ingredients from recipes as ingredient's array
        const ingredients = recipes.reduce((accumulator, recipe) => { 
        return accumulator.concat(recipe.ingredients);
        }, []);
        
        // store ingredients in groceryList object after adding duplicated ingredients.
        const groceryList = {};
        ingredients.forEach((ingredient)=> {
        
            let selectedSystem = unitSystem;
            // convert amount in fractions into float numbers as well as strings into numbers.
            const {name, amount, unit, type,} = ingredient;
            const ingredientAmount = numericQuantity(amount);
            
            // if duplicate ingredients, add their amounts with same units and then do unit conversion
            // else add both ingredients amount and units as array or list.
            if (name in groceryList){

            // duplicate ingredient found
            let duplicates = [ groceryList[name], { name, amount: ingredientAmount, unit, type }];
            let getUnitSystem = type === 'dry'? getUnitSystemForDry: getUnitSystemForWet;
            let addIngredients = type === 'dry'? addDryIngredients:addWetIngredients;
           
            if (typeof duplicates[0].amount === 'number'){
                 // if the ingredient amount in the grocery List is a number 
                if (duplicates[0].unit === duplicates[1].unit) {
                    // if both items have same unit, add their amounts
                    
                let addedAmount = duplicates[0].amount + duplicates[1].amount;
                    if (getUnitSystem(unit) === 'unknown'){
                        // invalid unit e.g cloves or can or any non-metric or non-customary unit 
                        // Simply add their amounts
                        groceryList[name].amount = addedAmount;
                    } else {
                        // units are valid
                        // Add their amounts
                        // After adding amounts, pass through add ingredients function to update amount to appropriate unit.
                        let result = addIngredients([{name, amount: addedAmount, unit, type}], selectedSystem);
                        groceryList[name].amount = result.amount;
                        groceryList[name].unit = result.unit;
                    }
                } else {
                    // units are different
                    // if both units are valid
                    if (getUnitSystem(duplicates[0].unit)!== 'unknown' && getUnitSystem(duplicates[1].unit)!== 'unknown' ){
                        let result = addIngredients(duplicates, selectedSystem);
                        groceryList[name].amount = result.amount;
                        groceryList[name].unit = result.unit;
                       
                    } else {
                        // if the units are invalid
                        // units are different and not valid units so can't be added, then store them as array.
                        groceryList[name].amount = [duplicates[0].amount, duplicates[1].amount];
                        groceryList[name].unit = [duplicates[0].unit, duplicates[1].unit];

                    } 
                    
                }     
                
            } else if (Array.isArray(duplicates[0].unit)) {
                // if amount or unit of the duplicate item in the groceryList object is an array
                // find the unit of the to be added ingredient inside the units array of the duplicate item in the groceryList object.
                let index = duplicates[0].unit.indexOf(duplicates[1].unit);
                // if unit found in groceryList i.e same units, simply add amounts
                if (index !== -1) {
                    let addedAmount = duplicates[0].amount[index] + duplicates[1].amount;
                    let unit = duplicates[1].unit; // or duplicates[0].unit[index]
                    if (getUnitSystem(unit) === 'unknown'){
                        // invalid unit
                        groceryList[name].amount[index] = addedAmount;
                        groceryList[name].unit[index] = unit;
                    } else {
                    // valid unit
                    // After adding amounts, pass item through add ingredients function to convert into appropriate unit.
                    let addedValue = addIngredients([{amount: addedAmount, unit:duplicates[1].unit}], selectedSystem)
                    groceryList[name].amount[index] = addedValue.amount;
                    groceryList[name].unit[index] = addedValue.unit;
                    }
                    
                } else {
                    // if unit not found in the duplicate's units array of groceryList object
                    // first push the amount and unit of to be added item into the groceryList item with same name
                    // Then run addIngredients function to add amounts with different units.
                    let addedIngredientsAmounts =  [...duplicates[0].amount, duplicates[1].amount];
                    let addedIngredientsUnits = [...duplicates[0].unit, duplicates[1].unit];
                    /*
                    Our add ingredients function take input as array of items as below
                    [
                        { amount: 12, unit: 'tsp', type: 'dry' },
                        { amount: 2, unit: 'tbsp', type: 'dry' },
                        { amount: 1, unit: 'cup', type: 'dry' }
                    ];
                    We will first convert our item data of amounts and unit into that format
                    Then we will separate out valid units from invalid ones.
                    */
                    const validUnitItems = [];
                    const invalidUnitItems = [];
                    addedIngredientsAmounts.forEach((amount, i) => {
                        let item = { amount: amount, unit: addedIngredientsUnits[i], type: type};
                        // check for valid unit system to separate out items with valid and invalid units
                        // Only items with valid units will be processes using add ingredients function to prevent bugs.

                        let getUnitSystem = type === 'dry'? getUnitSystemForDry: getUnitSystemForWet;
                        if (getUnitSystem(item.unit) !== 'unknown'){
                            // unit is valid 
                            validUnitItems.push(item);
                        } else {
                            // unit is invalid
                            invalidUnitItems.push(item);
                        }

                    });
                    // store both valid and invalid unit items in updatedItem array after processing through add ingredients function
                    const updatedItem = [];
                    if (validUnitItems.length) {
                        let addedItems = addIngredients(validUnitItems, selectedSystem);
                        updatedItem.push(addedItems);
                    }
                    if (invalidUnitItems.length){
                        // Add amounts with the same units
                        let storage = {};
                        invalidUnitItems.forEach(item => {
                            if (item.unit in storage){
                                storage[item.unit].amount+=item.amount;
                            } else {
                                storage[item.unit] = { amount: item.amount, unit: item.unit};
                            }
                        });
                        for (let key in storage){
                           updatedItem.push({amount: storage[key].amount, unit: key})
                        }
                    }
                    // Now store the amount and units of updated item array into their respective variables
                    // and update the  amount and unit of duplicate item in the groceryList to the values of those variables.
                    let amounts = [];
                    let units = [];
                    updatedItem.forEach(item => {
                        amounts.push(item.amount);
                        units.push(item.unit);
                    });
                    groceryList[name].amount = amounts;
                    groceryList[name].unit = units;
                }
            }
            } else {
                groceryList[name] = {
                    name: name,
                    amount: ingredientAmount,
                    unit: unit,
                    type: type

                }
            }
        
        })

        setGroceries(groceryList);
        setComponent(true);
    
        
    };
     return  (
        <React.Fragment>
            <ul className={styles.card}>
                { currentComponent ? <GroceryList groceries={groceries}/> :
                <>
                {recipes.map(item =>
                    <RenderListItem key={item.name} item={item} isFavorite={item.favorite} deleteItem={handleDeleteRecipes} addToFavorites={handleAddToFavorites} removeFromFavorites={handleRemoveFromFavorites} />

                )}
                <Button variant="success"  onClick={createIngredientsList}>Generate List</Button>

                </>}
            </ul>
        </React.Fragment>
        ) 
};
export default DisplayList;