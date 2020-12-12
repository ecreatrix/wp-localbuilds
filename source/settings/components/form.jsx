// External dependencies
import classnames from 'classnames/dedupe';
import { Field, ErrorMessage } from 'formik';

// WordPress dependencies
const { Fragment } = wp.element

const { __ } = wp.i18n;

// Internal dependencies

// Add dropdown options for select fields
export function getSelectOptions( item, itemKey ) {
    let options = null;

    if( item.type === 'select' && item.options ) {
        options = Object.keys( item.options ).map( ( optionKey, optionIndex ) => {
            let option = item.options[ optionKey ];

            return <option value={ optionKey } key={`option-${ itemKey }-${ optionIndex }` }>{ option }</option>
        } ) 
    }

    return options
}

export function getField( item, itemKey ) {
    let options = getSelectOptions( item, itemKey )

    // Add 'disabled' attr if field is disabled so HTML displays it without allowing input
    let field = <Field className='input' type={ item.type } name={ item.key } as={ item.as } key={ `${ itemKey }-input` } disabled={ item.type === 'disabled' }>{ options }</Field>

    field = item.prefix
        ? [ <span className='prefix' key={ `${ itemKey }-prefix` }> { item.prefix }</span>, field ]
        : field

    field = item.suffix
        ? [ field, <span className='suffix' key={ `${ itemKey }-suffix` }> { item.suffix }</span> ]
        : field

    return <span className='field' key={ itemKey }>{ field }</span>
}

export function subFields( item, itemKey ) {
    let fields = Object.keys( item.subfields ).map( ( subfieldKey, subfieldIndex ) => {
        let subfield = item.subfields[ subfieldKey ]

        return getField( subfield, `${ itemKey }-${ subfieldKey }` )
    } )

    return <span className='field subfields' key={ `${ itemKey }-subfields `}>{ fields }</span>
}

export function showField( item, values ) {
    let showField = true

    if( item.requires ) { 
        Object.keys( item.requires ).map( ( requiredKey, requiredIndex ) => {
            let required = item.requires[ requiredKey ]
            let currentValue = values[ requiredKey ]

            if( values[ requiredKey ] && currentValue !== required && !Array.isArray(required) ) {
                showField = false
            } else if( !values[ requiredKey ] ) {
                showField = false
            } else if( Array.isArray( required ) && !required.includes(currentValue ) ) {
                showField = false
            }
        } ) 
    }

    return showField
}

export default function formContent( message, isSubmitting, fields, values ) { 
    let messageBlock = ''
    let messageClass = classnames(
        'alert',
        message.classname ? `alert-${ message.classname }` : null
    );

    if( message.content && message.content.trim() != '' && message.content.length != 0 ) {
        messageBlock = <div className={ messageClass } dangerouslySetInnerHTML={ { __html: message.content } }></div>
    }

    return <Fragment>
        { messageBlock }
        <div className='form-blocks'>
            { Object.keys( fields ).map( ( fieldKey, fieldIndex ) => {
                // List all fields and their values if their corresponding show{x} fields are set to true
                let item = fields[fieldKey];

                let itemKey = `${ fieldKey }-${ fieldIndex }`
                
                let label = <h4 className="field label" key={ `label-${ itemKey }` }>{ item.label }</h4>

                //console.log(item)

                // Add subfields if set otherwise, use main field
                let field = item.subfields && Array.isArray( item.subfields ) 
                    ? subFields( item, itemKey )
                    : getField( item, itemKey ) 

                // Show label next to field instead of above for checkbox/radio fields
                let content = item.type === 'checkbox' || item.type === 'radio'
                    ? [ field, label ]
                    : [ label, field ]

                // Hide field if it's conditional field is not the current value
                return showField( item, values ) && <div className="container" key={ `item-${ itemKey }` }>
                        <div className="container" key={ `tab-${ item.key }` }>
                            { content }
                            <ErrorMessage className="alert alert-warning" name={ item.key } component="div" key={ `error-${ itemKey }` } />
                        </div>
                    </div>
            } ) }
        </div>
    </Fragment>
}
