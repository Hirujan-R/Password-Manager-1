import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket, faHouse } from "@fortawesome/free-solid-svg-icons";
import { Button } from "react-bootstrap";

const Header = () => {
    return (
        <div className="d-flex justify-content-end pe-4 pt-4">
            <Button className="me-3">
                <FontAwesomeIcon icon={faHouse} />
            </Button>

            <Button>
                <FontAwesomeIcon icon={faRightFromBracket}/>
            </Button>

        </div>
    )
};

export default Header;