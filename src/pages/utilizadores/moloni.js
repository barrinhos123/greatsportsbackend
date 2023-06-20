import React from 'react';
import { Button, Container, Row } from 'reactstrap';
import { client_id, client_secret, moloniPw, moloniUser } from 'services/consts';
import { getAuthorizationCodeFullValue } from 'services/faturacao/faturacao';

function MoloniPage() {
    return (
        <React.Fragment>
             <div className="page-content">
            <Container style={{padding: "20px"} }>
                <Row>
                    <h1>Moloni</h1>
                </Row>
                <Row>
                    <Button onClick={async () => {
                        await getAuthorizationCodeFullValue(client_id, client_secret, moloniUser, moloniPw)
                    }}>Moloni Log In</Button>
                </Row>
            </Container>
            </div>
        </React.Fragment>
      );
}

export default MoloniPage;