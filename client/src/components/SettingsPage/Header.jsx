import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket, faHouse } from "@fortawesome/free-solid-svg-icons";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const Header = () => {
    return (
        <div className="d-flex justify-content-end pe-4 pt-4">
            <Link to={'/main'}>
                <Button className="primary-button me-3">
                    <FontAwesomeIcon icon={faHouse} />
                </Button>
            </Link>
            
            <Link to={'/'}>
                <Button className="primary-button">
                    <FontAwesomeIcon icon={faRightFromBracket}/>
                </Button>
            </Link>
            

        </div>
    )
};

export default Header;