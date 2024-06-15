import IntlMessages from 'helpers/IntlMessages';
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button, Col, Input, Row } from 'reactstrap';

export default function LocalFile() {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    const onDrop = (acceptedFiles) => {
        if (selectedFiles.length + acceptedFiles.length > 10) {
            setErrorMessage('Maximum of 10 files allowed.');
        } else {
            setErrorMessage('');
            setSelectedFiles([...selectedFiles, ...acceptedFiles]);
        }
    };

    const handleDelete = (fileName) => {
        const updatedFiles = selectedFiles.filter((file) => file.name !== fileName);
        setSelectedFiles(updatedFiles);
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: ['image/*', '.txt', '.pdf', '.doc', '.docx'],
    });

    return (
        <>
            <Row >
                <Col
                    xs="6"
                >
                    <div >
                        <h6 className="font-weight-bold"><IntlMessages id="EMAIL_CONTENT_CONFIGURATION.TEXT.UPLOAD_TEMPLATE" /></h6>
                        <div {...getRootProps()} className="dropzone">
                            <p><IntlMessages id="EMAIL_CONTENT_CONFIGURATION.TEXT.DRAG_DROP" /></p>
                        </div>
                        {errorMessage && <p className="error">{errorMessage}</p>}
                    </div>
                </Col>
                <Col
                    xs="6"
                >
                    <div>
                        <h6 className="font-weight-bold">
                            <IntlMessages id="EMAIL_CONTENT_CONFIGURATION.TEXT.UPLOADED_FILE" />
                            {` (${selectedFiles.length}/10)`}
                        </h6>
                        <ul>
                            {selectedFiles.map((file) => (
                                <li key={file.name}>
                                    {file.name}
                                    <Button
                                        onClick={() => handleDelete(file.name)}
                                        className='delete-button'
                                    >&times;</Button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <Input {...getInputProps()} />
                </Col>
            </Row>
        </>
    );
}