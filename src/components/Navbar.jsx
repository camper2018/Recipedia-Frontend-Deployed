import { useState, useEffect} from 'react';
import { useNavigate} from 'react-router-dom';
import SearchComponent from './searchBar';
import RecipesDropdown from './dropdownForRecipes';
import styles from './Navbar.module.css';
import logo from '../assets/profile-picture-icon.jpg';
import logout from '../utilities/logout';
import ProfileDropdown from './profileDropdown';
const Navbar = ({ handleSearch, handleSelectMenu, setFavorites }) => {
    const navigate = useNavigate();
    const [userSettings, setUserSettings] = useState({
        username: null,
        avatar: logo
    });

    const handleLogout = () => {
        logout();
        setUserSettings({
            avatar: logo,
            username: null
        });
        setFavorites([]);
    }
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"))?.username;
        const storedAvatar = localStorage.getItem("profile-picture") || logo;
        setUserSettings({ username: storedUser, avatar: storedAvatar })
    }, []);

    return (
        <div className="container-fluid">
            <div className={"row  " + styles.container}>
                <div className="col-6 col-md-3 d-flex align-items-center justify-content-start h-100">
                    <div className={"mt-0 d-flex flex-column align-items-stretch justify-contents-between " + `${styles.btnContainer}`} >
                        <RecipesDropdown handleSelectMenu={handleSelectMenu} />
                    </div>
                </div>
                 <div className="col-6 col-md-3 d-flex d-md-none justify-content-end align-items-center">
                    <div className="d-flex flex-column align-items-end">
                        <ProfileDropdown userSettings={userSettings} handleLogout={handleLogout}  handleChange={setUserSettings}/>
                        <p className="text-center bg-black text-light">{userSettings.username}</p>
                    </div>
                </div>
                <div className="col col-md-6 offset-md-0 mx-0">
                    <SearchComponent handleSearch={handleSearch} />
                </div>
                <div className="col-6 col-md-3 d-none d-md-flex justify-content-end align-items-center">
                    <div className="d-flex flex-column align-items-end">
                        <ProfileDropdown userSettings={userSettings} handleLogout={handleLogout}  handleChange={setUserSettings}/>
                        <p className="text-center bg-black text-light">{userSettings.username}</p>
                    </div>
                </div>
            </div>
        </div >)
}

export default Navbar;