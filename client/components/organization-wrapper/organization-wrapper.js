import "./index.css";

import PropTypes from "prop-types";
import React from "react";
import {Cookies} from "react-cookie";
import {Helmet} from "react-helmet";
import {Redirect, Route, Switch} from "react-router-dom";

import getAssetPath from "../../utils/get-asset-path";
import ConnectedDoesNotExist from "../404";
import DoesNotExist from "../404/404";
import Footer from "../footer";
import Header from "../header";
import Login from "../login";
import PasswordConfirm from "../password-confirm";
import PasswordReset from "../password-reset";
import Registration from "../registration";
import Status from "../status";
import PasswordChangePage from "../password-change/password-change-page";

export default class OrganizationWrapper extends React.Component {
  constructor(props) {
    super(props);
    const {match, setOrganization, cookies} = props;
    const organizationSlug = match.params.organization;
    if (organizationSlug) setOrganization(organizationSlug, cookies);
  }

  componentDidUpdate(prevProps) {
    const {setOrganization, match, cookies} = this.props;
    if (prevProps.match.params.organization !== match.params.organization) {
      if (match.params.organization)
        setOrganization(match.params.organization, cookies);
    }
  }

  render() {
    const {organization, match, cookies} = this.props;
    const {title, favicon, isAuthenticated} = organization.configuration;
    const orgSlug = organization.configuration.slug;
    const cssPath = organization.configuration.css_path;
    if (organization.exists === true) {
      return (
        <React.Fragment>
          <div className="owisp-app-container">
            <Route
              path={match.path}
              render={({location}) => <Header location={location} />}
            />
            <Switch>
              <Route
                path={`${match.path}`}
                exact
                render={() => {
                  return <Redirect to={`/${orgSlug}/login`} />;
                }}
              />
              <Route
                path={`${match.path}/registration`}
                render={props => {
                  if (isAuthenticated)
                    return <Redirect to={`/${orgSlug}/status`} />;
                  return <Registration {...props} />;
                }}
              />
              <Route
                path={`${match.path}/password/reset/confirm/:uid/:token`}
                render={props => {
                  if (isAuthenticated)
                    return <Redirect to={`/${orgSlug}/status`} />;
                  return <PasswordConfirm {...props} />;
                }}
              />
              <Route
                path={`${match.path}/password/reset`}
                exact
                render={() => {
                  if (isAuthenticated)
                    return <Redirect to={`/${orgSlug}/status`} />;
                  return <PasswordReset />;
                }}
              />
              <Route
                path={`${match.path}/login`}
                render={props => {
                  if (isAuthenticated)
                    return <Redirect to={`/${orgSlug}/status`} />;
                  return <Login {...props} />;
                }}
              />
              <Route
                path={`${match.path}/status`}
                render={() => {
                  // if (isAuthenticated) return <Status cookies={cookies} />;
                  // return <Redirect to={`/${orgSlug}/login`} />;
                  return <Status cookies={cookies} />;
                }}
              />
              <Route
                path={`${match.path}/change-password`}
                render={() => {
                  return <PasswordChangePage />;
                }}
              />
              <Route
                render={() => {
                  return <ConnectedDoesNotExist />;
                }}
              />
            </Switch>
            <Route path={match.path} render={() => <Footer />} />
          </div>
          {title ? (
            <Helmet>
              <title>{title}</title>
            </Helmet>
          ) : null}
          {cssPath && orgSlug ? (
            <Helmet>
              <link rel="stylesheet" href={getAssetPath(orgSlug, cssPath)} />
            </Helmet>
          ) : null}
          {favicon && orgSlug ? (
            <Helmet>
              <link
                rel="shortcut icon"
                type="image/x-icon"
                href={getAssetPath(orgSlug, favicon)}
              />
            </Helmet>
          ) : null}
        </React.Fragment>
      );
    }
    if (organization.exists === false) {
      return (
        <React.Fragment>
          <div className="owisp-org-wrapper-not-found">
            <DoesNotExist />
          </div>
          <Helmet>
            <title>Page not found</title>
          </Helmet>
        </React.Fragment>
      );
    }
    return (
      <div className="owisp-loader-container">
        <div className="owisp-loader" />
      </div>
    );
  }
}

OrganizationWrapper.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      organization: PropTypes.string.isRequired,
    }),
    path: PropTypes.string,
  }).isRequired,
  setOrganization: PropTypes.func.isRequired,
  organization: PropTypes.shape({
    configuration: PropTypes.shape({
      title: PropTypes.string,
      css_path: PropTypes.string,
      slug: PropTypes.string,
      favicon: PropTypes.string,
      isAuthenticated: PropTypes.bool,
    }),
    exists: PropTypes.bool,
  }).isRequired,
  cookies: PropTypes.instanceOf(Cookies).isRequired,
};
