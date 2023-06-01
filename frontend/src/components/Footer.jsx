import React from "react";
// import "./Footer.css";

function Footer() {
  return (
    <div style={{color: 'white', backgroundColor: '#dc3545', paddingTop: '3em', position: 'relative', bottom: '0', width: '100%'}}>
      <div>
        <div className="row">
          <p className="col-sm">
            &copy;{new Date().getFullYear()} THICC MEMES | All rights reserved |
            Terms Of Service | Privacy
          </p>
        </div>
      </div>
    </div>
  );
}

export default Footer;