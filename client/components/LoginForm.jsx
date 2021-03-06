import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import connector from '../connector';

class LoginForm extends Component {

    constructor(props) {
        super(props);

        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleLoginAttempt = this.handleLoginAttempt.bind(this);
    }

    handleEmailChange(event) {
        this.setState({ email: event.target.value });
    }

    handlePasswordChange(event) {
        this.setState({ password: event.target.value });
    }

    handleLoginAttempt() {
        this.props.login(this.state);
    }

    getError(response) {
        return response && response.rejected
            ? 'Invalid e-mail or password!'
            : '';
    }

    componentWillMount() {
        this.setState({
            email: '',
            password: ''
        });
    }

    componentDidUpdate() {
        const response = this.props.loginResponse;
        if (response && response.fulfilled) {
            browserHistory.push('/tasks');
        }
    }

    render() {
        const response = this.props.loginResponse;
        const errorMessage = this.getError(response);

        return (
            <div className="login-form">
                <TextField
                    floatingLabelText="E-mail"
                    onChange={ this.handleEmailChange }
                    fullWidth={ true }
                />
                <TextField
                    floatingLabelText="Password"
                    type="password"
                    onChange={ this.handlePasswordChange }
                    fullWidth={ true }
                />
                <span>{ errorMessage }</span>
                <RaisedButton
                    className="login-button"
                    label="Login"
                    disabled={
                        response
                        && response.pending
                    }
                    secondary={ true }
                    onTouchTap={ this.handleLoginAttempt }
                />
            </div>
        );
    }
}

LoginForm.propTypes = {
    login: React.PropTypes.func.isRequired,
    loginResponse: React.PropTypes.object
};

export default connector(() => {
    return {
        login: userLogin => ({
            loginResponse: {
                url: 'api/auth',
                method: 'POST',
                body: JSON.stringify(userLogin),
                force: true
            }
        })
    };
})(LoginForm);
