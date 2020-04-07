import "bootswatch/dist/lux/bootstrap.min.css";
import React from 'react';
import Modal  from 'react-bootstrap/Modal';

function Alert({ msg, show, onHide }) {
    return (
        <Modal
            size="md"
            show={show}
            onHide={onHide}
            aria-labelledby="error"
        >
            <Modal.Header closeButton>
                <Modal.Title id="error">
                    Error!
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>{msg}</Modal.Body>
        </Modal>
    );
}

export default Alert
