import { Dropdown } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';
import localStore from '../utilities/localStorage';
const frontendBaseUrl = import.meta.env.VITE_FRONTEND_URL;
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
                        <input {...getInputProps()}/>
                        Change Profile Image
                    </div>

                </Dropdown.Item>
                {userSettings.username ?
                    <Dropdown.Item className="text-secondary" href="/" onClick={handleLogout}>Logout</Dropdown.Item> :
                    <Dropdown.Item className="text-secondary" href={`${frontendBaseUrl}/login`}>Login</Dropdown.Item>}
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default ProfileDropdown;
