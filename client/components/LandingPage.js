import React from 'react';
import { Link } from 'react-router-dom';
import Strings from '../json/strings.json';
import Login from '../containers/Login';
import Logout from '../containers/Logout';
import { Carousel } from 'react-responsive-carousel';

class LandingPage extends React.Component {
    render() {
        return <div id="LandingPage">

                
               <nav className="navbar navbar-toggleable-md navbar-light bg-faded fixed-top">
                    <a className="navbar-brand" href="#">TextRoulette</a>
                    <div>
                      <input className="btn my-2 my-sm-0" type="button" id="about-us" value="About Us" />
                      <input className="btn my-2 my-sm-0" type="button" id="sign-in" value="Sign in" />
                    </div>      
                </nav> 

                {/* Tried out different navbars, but couldn't get them to work
                
                <nav className="navbar navbar-toggleable-md navbar-light bg-faded">
                    <a className="navbar-brand" href="#">Navbar</a>
                    <div className="collapse navbar-collapse" id="navbarNav">
                      <ul className="navbar-nav">
                        <li className="nav-item active">
                          <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>
                        </li>
                        <li className="nav-item">
                          <a className="nav-link" href="#">Features</a>
                        </li>
                        <li className="nav-item">
                          <a className="nav-link" href="#">Pricing</a>
                        </li>
                        <li className="nav-item">
                          <a className="nav-link disabled" href="#">Disabled</a>
                        </li>
                      </ul>
                    </div>
                </nav>
                

                <nav className="navbar navbar-expand-lg navbar-light fixed-top" id="mainNav">
                    <div className="container">
                      <a className="navbar-brand js-scroll-trigger" href="#page-top">Political Chatroulette</a>
                      <div className="collapse navbar-collapse" id="navbarResponsive">
                        <ul className="navbar-nav text-uppercase ml-auto">
                          <li className="nav-item">
                            <a className="nav-link js-scroll-trigger" href="#about">About Us</a>
                          </li>
                          <li className="nav-item">
                            <div className="text-center">
                                <button type="submit" className="btn btn-primary">Sign in</button>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </nav>
                  */}
              

                {/* this puts a picture and text on top of it. Pic link is in the Css*/}
                <header className="masthead text-white text-center">
                    <div className="overlay" />
                    <div className="container">
                      <div className="row">
                        <div className="col-xl-6 mx-auto">
                          <h1 className="mb-5">Join the Conversation!</h1>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-12">
                          <div className="text-center">
                            <Login />
                          </div>
                        </div>
                      </div>

                    </div>
                </header>

            

                {/* Carousel*/}
                <Carousel showThumbs={false} showStatus={false} infiniteLoop={true} emulateTouch={true}>
                    <div>
                        <img src={require("../static/preview1.png")} />
                        <p className="legend">Share your views on trending topics and issues.</p>
                    </div>
                    <div>
                        <img src={require("../static/preview2.png")} />
                        <p className="legend">Have a discussion with someone with different views.</p>
                    </div>
                    <div>
                        <img src={require("../static/preview3.png")} />
                        <p className="legend">Rate your partner and earn badges for having great conversations.</p>
                    </div>
                </Carousel>
            

                {/* this puts a picture and text side by side. Pic link is in the Css*/}
                <section className="showcase">
                <div className="container-fluid p-0">
                  <div className="row no-gutters">
                    <div className="col-lg-6  showcase-img"> 
                    </div>
                    <div className="col-lg-6 order-lg-2 my-auto showcase-text text-center">
                      <h2>Start Chatting Now</h2>
                      <p className="lead mb-0">Talk face-to-face with others from across the country on the issues that matter!</p>
                      <br />
                      <Login />
                    </div>
                  </div>
                </div>
              </section>

                <br />
                 <div className="footer-copyright">
                    <div className="text-center">
                    <div className="container-fluid">
                        © 2017 Copyright: CS96
                    </div>
                    </div>
                </div>

        </div>
    }
}
export default LandingPage;

