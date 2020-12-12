// External dependencies
import classnames from 'classnames/dedupe'
import { Formik, Form } from 'formik';

// WordPress dependencies
const { Component, Fragment } = wp.element

const { apiFetch } = wp

const { __ } = wp.i18n

// Internal dependencies
import adminPanel from './panels/admin';
import ContainerBlock from  '../components/blocks';
import formContent from  '../components/form';

// Constants
//const currentPage = rest.currentPage
let reset = false;

// TODO set page as grey if redirect will need to happen
export default class Blocks extends Component {
    constructor( props ) {
        super( props )

        //console.log(props.data.settings)
        this.state = {
            message: '',
            messageType: '', // used to change message class if an error has occured

            ...this.getAdmin( props.data.settings ),
        }

        this.state.activeCategory = 'admin'
    }

    sectionAdmin() {
        let panel = adminPanel( this.state )

        return this.makeForm( panel )
    }

    getAdmin( admin ) {
        return {
            devMode: admin && admin.devMode  || '', 
        }
    }

    // Called by Formik submit, update state and db from settings
    onSubmit( settings, { setSubmitting } ) { 
        const {
            messageType,
        } = this.state
        apiFetch( {
            path: '/walcbld/v1/settings',
            method: 'POST', 
            data: { 
                currentPage: this.props.data.currentPage,
                values: settings,
                reset,
            },
        } )
        .then( ( result ) => {
            if ( result.type == 'error' ) { 
                console.log( 'error' )
                console.log( result )
            }

            let info = result.returned ? JSON.parse( result.returned ) : false

            this.setState( {
                message: result.message || null,
                messageType: result.type || null,

                // Get value from php or AJAX supplied versions 
                ...this.getAdmin( info || settings ),
            } )

            setSubmitting ? setSubmitting( false ) : null
            reset = false
        } )
    }

    makeForm( panel ) {
        let initialValues = {
            ...panel.initialValues,
            ...this.state
        }

        let {
            message,
            messageType,
        } = this.state

        let disableButton = false;

        return <Formik
            enableReinitialize
            initialValues={ initialValues }
            onSubmit={ ( values, { setSubmitting} ) => { 
                this.onSubmit( values, { setSubmitting } )
            } }
            validationSchema={ panel.validation }
        >
            { ( { errors, values, isSubmitting } ) => ( 
                <Form onChange={
                    () => {
                        this.setState( {
                            message: '',
                            messageClass: '',
                        } )
                    } } >
                    { formContent( { content: message, classname: messageType }, isSubmitting, panel.fields, values ) }
                    { ! disableButton && ( 
                        <div className="container buttons">
                            <button className="btn btn-primary" type="submit" disabled={ isSubmitting }>Save Settings</button>
                            
                            <button className="btn btn-tertiary" type="submit" disabled={ isSubmitting } onClick={ () => { reset = true } }>Reset Settings</button>
                        </div> 
                    ) }
                </Form>
            ) }
        </Formik>
    }

    render() {
        let sections = {
            admin: {
                label: 'Admin',
                blocks: [ 
                    this.sectionAdmin( ), 
                ],
            }, 
        }

        return (
            <Fragment>
                <div
                    className={ classnames(
                        'tab',
                        'blocks',
                    ) }
                >
                    <ContainerBlock { ...this.state } sections={ sections } />
                </div>
            </Fragment>
        )
    }
}