import * as Yup from 'yup';

export default function admin( props ) {
    const {
    } = props

    let fields = { 
        devMode: { key: 'devMode', label: 'Activate Dev Mode', type: 'checkbox', as: null },
    }

    let initialValues = { 
        ...props,
    }

    // No validation needed
    let validation = Yup.object( {} )

    return { fields, initialValues, validation }
}
