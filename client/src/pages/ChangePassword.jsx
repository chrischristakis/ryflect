import { useEffect, useRef } from 'react';
import useForm from '../hooks/useForm';
import Button from '../components/Button';
import { toast } from 'react-toastify';
import { API_URL } from '../config';
import axios from 'axios';
import { handleError } from '../utils/HandleResponse';
import Input from '../components/Input';

function ChangePassword() {

    const oldPassRef = useRef(null);
    const newPassRef = useRef(null);
    const confirmPassRef = useRef(null);

    const passwordsMatch = useRef(true);

    const form = useForm({
        oldPass: {
            value: '',
            ref: oldPassRef
        },
        newPass: {
            value: '',
            ref: newPassRef
        },
        confirmPass: {
            value: '',
            ref: confirmPassRef
        },
    });

    useEffect(() => {
        if(form.data.newPass.value !== form.data.confirmPass.value) {
            form.offendingField(form.data.confirmPass);
            passwordsMatch.current = false;
        }
        else {
            form.defaultField(form.data.confirmPass);
            passwordsMatch.current = true;
        }
    }, [form.data.newPass.value, form.data.confirmPass.value, form]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        form.resetFieldsStyle();
        if(!passwordsMatch.current) {
            form.offendingField(form.data.newPass);
            form.offendingField(form.data.confirmPass);
            return toast.error("'New password' and 'Confirm new password' do not match.", {position: 'top-center'});
        }

        const body = {
            oldPass: form.data.oldPass.value,
            newPass: form.data.newPass.value
        };

        try {
            const response = await axios.put(API_URL + '/api/auth/change-password', body);
            toast.success(response.data, {position: 'top-center'});
        }
        catch(err) {
            const offendingFields = handleError(err);
            form.handleOffendingFields(offendingFields);
        }
    }

    return (
        <div>
            <h3>Change password</h3>
            <Input 
                label='current password:'
                name='oldPass'
                ref={oldPassRef}
                type='text'
                onChange={form.handleDataChange}
            />
            <Input 
                label='new password:'
                name='newPass'
                ref={newPassRef}
                type='text'
                onChange={form.handleDataChange}
            />
            <Input 
                label='confirm new password:'
                name='confirmPass'
                ref={confirmPassRef}
                type='text'
                onChange={form.handleDataChange}
            />
            <Button text='change password' clickEvent={handleSubmit}/>
        </div>
    );
}

export default ChangePassword;