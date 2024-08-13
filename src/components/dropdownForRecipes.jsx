import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { IoIosLock } from "react-icons/io";

const RecipesDropdown = ({ handleSelectMenu }) => {
  const navigate = useNavigate();
  return (
    <Dropdown>
      <DropdownButton className="my-2" id="dropdown-basic-button" variant="outline-success" title="Recipes" onSelect={(e) => {
        if (e)
          handleSelectMenu(e);
        navigate('/recipes')
      }}>

        <Dropdown.ItemText className="py-2 fw-bold">Get Recipes:</Dropdown.ItemText>
        <Dropdown.Item className="text-secondary" eventKey="1">1 Day</Dropdown.Item>
        <Dropdown.Item className="text-secondary" eventKey="2">2 Days</Dropdown.Item>
        <Dropdown.Item className="text-secondary" eventKey="3">3 Days</Dropdown.Item>
        <Dropdown.Item className="text-secondary" eventKey="4">4 Days</Dropdown.Item>
        <Dropdown.Item className="text-secondary" eventKey="5">5 Days</Dropdown.Item>
        <Dropdown.Item className="text-secondary" eventKey="6">6 Days</Dropdown.Item>
        <Dropdown.Item className="text-secondary" eventKey="7">1 Week</Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item className="text-secondary" eventKey="favorites">Favorites</Dropdown.Item>
        <Button className="bg-transparent text-secondary border-0 ms-1" onClick={() => { navigate('/my-recipes') }}>
          My Recipes<IoIosLock className='text-secondary ms-2 mb-1' />
        </Button>

      </DropdownButton>

    </Dropdown>
  );
}

export default RecipesDropdown;





