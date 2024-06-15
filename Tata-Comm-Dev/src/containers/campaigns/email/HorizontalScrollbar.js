import React from 'react';
import { Container, Row, Col } from 'reactstrap';

const HorizontalScrollbar = ({ children }) => {
  return (
    <Container className="horizontal-scrollbar">
      <Row className="overflow-x-scroll">
        <Col>{children}</Col>
      </Row>
    </Container>
  );
};

export default HorizontalScrollbar;
