import { useState, useEffect} from 'react';
import SearchComponent from './searchBar';
import RecipesDropdown from './dropdownForRecipes';
import styles from './Navbar.module.css';
import logo from '../assets/profile-picture-icon.jpg';
import logout from '../utilities/logout';
import localStore from '../utilities/localStorage';
import ProfileDropdown from './profileDropdown';

const Navbar = ({ handleSearch, handleSelectMenu, setFavorites }) => {
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
        const storedUser = JSON.parse(localStore.getUser())?.username;
        const storedAvatar = localStore.getImage()|| logo;
        setUserSettings({ username: storedUser, avatar: storedAvatar })
    }, []);

    return (
        <div className="container-fluid">
            <div className={"row py-3 py-md-4  " + styles.container}>
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
                 <div className="col col-md-4 offset-md-1 mx-0">
                    <SearchComponent handleSearch={handleSearch} />
                </div>
                 <div className="col-6 col-md-4 col-lg-3 d-none d-md-flex justify-content-end align-items-center">
                    <div className="d-flex align-items-center justify-content-end">
                      <p className="me-2 text-center bg-black text-light">{userSettings.username}</p>
                      <ProfileDropdown userSettings={userSettings} handleLogout={handleLogout}  handleChange={setUserSettings}/>
                    </div>
                </div>
            </div>
        </div >)
}

export default Navbar;