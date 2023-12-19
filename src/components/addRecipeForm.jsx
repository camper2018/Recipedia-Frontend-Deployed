import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { FaPlus } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { CiStar } from "react-icons/ci";
import { dryConversionFactors } from '../utilities/addDryIngredients';
import { wetConversionFactors } from '../utilities/addWetIngredients';
import { metricDryConversionFactors } from '../utilities/addDryIngredients';
import { metricWetConversionFactors } from '../utilities/addWetIngredients';
import { isPlural } from '../utilities/findPlural';
import { numericQuantity } from 'numeric-quantity';
import { IoMdClose } from "react-icons/io";
import { v4 as uuidv4 } from 'uuid';
import styles from './addRecipe.module.css';

const RecipeForm = ({ unitSystem, addRecipe, categories }) => {
    const uuid = uuidv4();
    const [show, setShow] = useState(false);
    const [isFavorite, setFavorite] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [htmlForAddItem, setHTML] = useState([{ id: uuid }]);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const handleAddToFavorite = () => {
        setFavorite(true);
    };
    const handleRemoveFromFavorites = () => {
        setFavorite(false);
    };
    const createOptionHTMLForUnits = (unitSystem) => {
        const html = [];
        let conversionFactorsForDry;
        let conversionFactorsForWet;
        if (unitSystem === 'customary') {
            conversionFactorsForDry = dryConversionFactors;
            conversionFactorsForWet = wetConversionFactors;
        } else {
            conversionFactorsForDry = metricDryConversionFactors;
            conversionFactorsForWet = metricWetConversionFactors;
        }
        let htmlForDry = Object.keys(conversionFactorsForDry).map((factor, i) => (<option key={factor + 'dry' + i} value={factor + " " + "dry"}>{factor}&nbsp; *dry</option>));
        let htmlForWet = Object.keys(conversionFactorsForWet).map((factor, j) => (<option key={factor + 'wet' + j} value={factor + " " + "wet"}>{factor}&nbsp; *liquid</option>));
        html.push(htmlForDry, htmlForWet);
        return html;

    }
    const optionsHTML = createOptionHTMLForUnits(unitSystem);
    const createOptionHTMLForCategory = () => {
        return Object.keys(categories).map(category => (
            <option key={category} value={category}>{category}</option>)
        );

    };
    const optionsHTMLForCategory = createOptionHTMLForCategory();

    const handleAddFormEl = () => {
        // adds a form field for taking user input for adding an ingredient / item to the recipe ingredients.
        const id = uuidv4();
        setHTML([...htmlForAddItem, { id: id }]);
    }
    const handleRemoveFormEl = (id) => {
        // removes a form field for taking user input for adding an ingredient / item to the recipe ingredients.
        // const htmlList = [...htmlForAddItem];
        // htmlList.splice(index, 1);
        const htmlList = htmlForAddItem.filter(html => html.id !== id);
        setHTML(htmlList);
    }
    const handleItemName = (e) => {
        let name = e.target.value;
        if (isPlural(name)) {
            setErrors({ ...errors, itemName: 'Please enter ingredient name in singular form!' });
        } else if (name === '') {
            setErrors({ ...errors, itemName: 'Please enter ingredient name!' });
        } else {
            setErrors({ ...errors, itemName: null })
        }
    }
    const handleItemAmount = (e) => {
        if (isNaN(numericQuantity(e.target.value))) {
            setErrors({ ...errors, itemAmount: 'Please enter a valid numeric amount!' });
        } else {
            setErrors({ ...errors, itemAmount: null });
        }
    }
    const handleName = (e) => {
        if (!e.target.value) {
            setErrors({ ...errors, name: 'Recipe name is required!' });
        } else {
            setErrors({ ...errors, name: null });
        }
    }

    return (
        <React.Fragment>
            <Button variant="danger" onClick={handleShow} className="my-2">
            {/* <Button variant="danger" onClick={() => {navigate('/add-recipe') }} className="my-2"> */}
                Add Recipe&nbsp;
                <FaPlus />
            </Button>

            <Modal className={styles.modal} size="lg" show={show} onHide={()=> {handleClose(); navigate('/')}}>
                <Modal.Header closeButton>
                    <div>
                        {isFavorite ? <FaStar size={30} fill={"orange"} onClick={handleRemoveFromFavorites} /> :
                            <CiStar size={34} onClick={handleAddToFavorite} />
                        }
                    </div>
                    <Modal.Title style={{ margin: "0 auto" }}>Create Your Recipe Here</Modal.Title>

                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={(e) => {
                        addRecipe(e, isFavorite, errors);
                        handleClose();
                        navigate('/');
                    }}
                        id="addRecipeForm"
                    >
                        <Form.Group className="mb-3" controlId="recipeForm.ControlInput1">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Recipe Name"
                                autoFocus
                                autoComplete='on'
                                name="name"
                                isInvalid={!!errors.name}
                                onBlur={handleName}

                            />

                        </Form.Group>
                        <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                        <Form.Group
                            className="mb-3"
                            controlId="recipeForm.ControlTextarea1"
                        >
                            <Form.Label>Method</Form.Label>
                            <Form.Control as="textarea" name="method" />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="recipeForm.ControlInput2">
                            <Form.Label>Tag/ Tags</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="vegan, gluten-free, dairy-free, seafood,egg-free"
                                name="tags"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="recipeForm.ControlInput3">
                            <Form.Label>Ingredients</Form.Label>
                            <Button className='float-end ' variant="secondary" onClick={handleAddFormEl}>ADD</Button>
                            {htmlForAddItem.map(html => (
                                <div key={html.id} className='d-flex mt-3' name="ingredients" >
                                    <Form.Control
                                        type="text"
                                        placeholder="Name"
                                        name="ingredientName"
                                        isInvalid={!!errors.itemName}
                                        onBlur={handleItemName}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.itemName}</Form.Control.Feedback>
                                    <Form.Control
                                        type="text"
                                        placeholder="Amount"
                                        className='mx-1'
                                        name="ingredientAmount"
                                        isInvalid={!!errors.itemAmount}
                                        onBlur={handleItemAmount}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.itemAmount}</Form.Control.Feedback>
                                    <Form.Select aria-label="select unit for ingredient" name="ingredientUnit">
                                        <option key="none dry" value={"none" + " " + "dry"}>Unit</option>
                                        {optionsHTML}
                                    </Form.Select>
                                    <Form.Select aria-label="select category for ingredient" name="ingredientCategory">
                                        <option key="none" value="none">Category</option>
                                        {optionsHTMLForCategory}
                                    </Form.Select>

                                    {htmlForAddItem.length > 1 &&
                                        <div className="ms-2 border border-danger rounded" >
                                            <IoMdClose size={36} onClick={() => handleRemoveFormEl(html.id)} />
                                        </div>}
                                </div>
                            ))
                            }
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button className={styles.btnClose} variant="secondary" onClick={()=> {handleClose(); navigate('/')}}>
                        Cancel
                    </Button>
                    <Button type="submit" className={styles.btnSubmit} variant="primary" form="addRecipeForm">
                        Save
                    </Button>
                </Modal.Footer>

            </Modal>
        </React.Fragment>);
}

export default RecipeForm;
