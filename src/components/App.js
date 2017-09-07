import React, {Component} from "react";
import {Route, Link} from "react-router-dom";
import {inject, observer} from "mobx-react";
import LazyRoute from "lazy-route";
import DevTools from "mobx-react-devtools";
import {CSSTransitionGroup} from 'react-transition-group'
import ReactCSSTransitionGroup from "react-addons-css-transition-group";



@inject("store")
@observer
export default class App extends Component {
  constructor(props) {
    super(props);
    this.store = this.props.store;
  }
  componentDidMount() {
    this.authenticate();
    // console.log(this.props)
    // console.log(location)
    window.addEventListener('hashchange',()=>{
      console.log('hashchange')
    })
  }
  authenticate(e) {
    if (e)
    e.preventDefault();
    this.store.appState.authenticate();
    // this.store.Mix.setMix(16)

  }
  render() {
    const {authenticated, authenticating, timeToRefresh, refreshToken, testval} = this.store.appState;
    return (
      <ReactCSSTransitionGroup component="div" className="react-container" transitionName="slide-in" transitionEnterTimeout={300} transitionLeaveTimeout={300}>
        <div key={location.pathname} className="wrapper">
          <Route exact path="/" render={props => (<LazyRoute {...props} component={import ("./Music.js")}/>)}/>
        </div>
      </ReactCSSTransitionGroup>
    );
  }
}
