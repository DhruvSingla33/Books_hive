import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './Footer.css';

import { Container, Row, Col } from "react-bootstrap";
import {
  AiFillGithub,
  AiOutlineTwitter,
  AiFillInstagram,
} from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <Container>
        <Row className="footer-content">
          <Col md={4} className="footer-text">
            <p>Designed & Developed by <strong>Dhruv Singla</strong></p>
          </Col>
          <Col md={4} className="footer-text">
            <p>© {year} DS. All rights reserved.</p>
          </Col>
          <Col md={4} className="footer-social">
            <ul className="social-links">
              <li>
                <a
                  href="https://github.com/DhruvSingla33/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                >
                  <AiFillGithub />
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/dhruv-singla30/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <FaLinkedinIn />
                </a>
              </li>
              <li>
                <a
                  href="mailto:singladhruv301@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Email"
                >
                  <MdEmail />
                </a>
              </li>
            </ul>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
