import React, { Component } from 'react'
import moment from 'moment'
import { Formik, Form, Field, ErrorMessage} from 'formik';

import TodoDataService from '../api/todo/TodoDataService.js'
import AuthenticationService from './AuthenticationService.js'
import './TodoCo.css';

class TodoCo extends Component {
    constructor(props) {
        super(props)

        this.state = {
            id: this.props.match.params.id,
            description: '',
            targetDate: moment(new Date()).format('YYYY-MM-DD')
        }

        this.onSubmit = this.onSubmit.bind(this)
        this.validate = this.validate.bind(this)

    }s

    componentDidMount() {

        if (this.state.id === -1) {
            return
        }

        let username = AuthenticationService.getLoggedInUserName()

        TodoDataService.retrieveTodo(username, this.state.id)
        // .then(response => console.log(response))
            .then(response => this.setState({
                description: response.data.description,
                targetDate: moment(response.data.targetDate).format('YYYY-MM-DD')
            }))
    }

    validate(values) {
        let errors = {}
        if (!values.description) {
            errors.description = 'Enter a Description'
        } else if (values.description.length < 5) {
            errors.description = 'Enter atleast 5 Characters in Description'
        }

        if (!moment(values.targetDate).isValid()) {
            errors.targetDate = 'Enter a valid Target Date'
        }

        return errors
    //
    }

    onSubmit(values) {
      console.log(values);
        let username = AuthenticationService.getLoggedInUserName()
        let todo = {
        id: this.state.id,
        description: values.description,
        targetDate: values.targetDate
        }

        if (this.state.id === -1) {
            TodoDataService.createTodo(username, todo)
                .then(() => this.props.history.push('/todos'))
        } else {
            TodoDataService.updateTodo(username, this.state.id, todo)
                .then(() => this.props.history.push('/todos'))
        }

        console.log(values);
      }

    render() {

        let { description , targetDate } = this.state
        //let targetDate = this.state.targetDate

        return (
            <div>
              {/* {this.props.match.params.name} */}
                <h1>Todo</h1>
              <div className="container">
                    <Formik

                      initialValues={{ description, targetDate }}
                      onSubmit={this.onSubmit}
                      validateOnChange={false}
                      validateOnBlur={false}
                      validate={this.validate}
                      enableReinitialize={true}
                      >
                      {
                        (props) => (
                          <Form>
                            <ErrorMessage name="description" component="div"
                                        className="alert alert-primary" />
                            <ErrorMessage name="targetDate" component="div"
                                        className="alert alert-secondary" />
                            <fieldset className="form-group">
                                        <label>Description</label>
                                        <Field className="form-control" type="text" name="description" />
                            </fieldset>
                            <fieldset className="form-group">
                                        <label>Target Date</label>
                                        <Field className="form-control" type="date" name="targetDate" />
                            </fieldset>
                            <button className="vibesbutton2" type="submit">Save</button>
                          </Form>
                        )

                      }

                    </Formik>

                </div>
            </div>
        )
    }
}

export default TodoCo
