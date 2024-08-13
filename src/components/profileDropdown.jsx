import { Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import localStore from '../utilities/localStorage';
const baseUrl = import.meta.env.VITE_BASE_URL;
const ProfileDropdown = ({ userSettings, handleLogout, handleChange }) => {

    // handle image upload
    const onDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result;
            handleChange({
                ...userSettings,
                avatar: result
            });
            localStore.saveImage(result);
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    return (
        <Dropdown>

            <Dropdown.Toggle variant="outline-success" id="dropdown-basic">
                <img
                    src={userSettings.avatar || ''}
                    alt="Profile image"
                    style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                />
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <Dropdown.Item href="#" className="text-secondary">
                    <div {...getRootProps()} className="cursor-pointer">
                        <input {...getInputProps()} />
                        Change Profile Image
                    </div>

                </Dropdown.Item>
                {userSettings.username ?
                    (<Dropdown.Item  as="button"><Link to="/" onClick={handleLogout} className="text-secondary text-decoration-none pe-5">Logout</Link></Dropdown.Item>) :
                    (<Dropdown.Item as="button"><Link to="/login" className="text-secondary text-decoration-none pe-5">Login</Link></Dropdown.Item>)}
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default ProfileDropdown;
