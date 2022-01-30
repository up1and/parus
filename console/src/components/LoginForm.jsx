import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Stack, Input, Button, FormControl, InputGroup, InputLeftElement, InputRightElement, FormErrorMessage, useToast, chakra } from '@chakra-ui/react';
import { ViewOffIcon, ViewIcon } from '@chakra-ui/icons'
import { FaUserAlt, FaLock } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import axios from 'axios';

import useAuth from '../stores/auth';
import { useToastMessage } from '../hooks';


const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);


function LoginForm(props) {
  const [showPassword, setShowPassword] = useState(false);
  const handlePasswordVisibility = () => setShowPassword(!showPassword);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const [toastMessage, setToastMessage] = useToastMessage();
  const login = useAuth(state => state.login);

  const navigate = useNavigate();
  const referer = location.state?.from?.pathname || '/';

  const onSubmit = data => {
    axios.post('/api/auth/login', data).then(res => {
      login(res.data);
      navigate(referer, { replace: true });
    }).catch(err => {
      console.log(err.toString());
      setToastMessage({
        title: 'Error',
        description: err.toString(),
        status: 'error',
      });
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack
        spacing={4}
        p='1rem'
      >
        <FormControl isInvalid={errors.username}>
          <InputGroup size='sm'>
            <InputLeftElement
              pointerEvents='none'
              children={<CFaUserAlt color='gray.300' />}
            />
            <Input 
              placeholder='Username'
              {...register('username', { required: true })}
            />
          </InputGroup>
        </FormControl>

        <FormControl isInvalid={errors.password}>
          <InputGroup size='sm'>
            <InputLeftElement
              pointerEvents='none'
              color='gray.300'
              children={<CFaLock color='gray.300' />}
            />
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder='Password'
              {...register('password', { required: true })}
            />
            <InputRightElement width='2.5rem'>
              <Button size='xs' onClick={handlePasswordVisibility}>
                {showPassword ? <ViewIcon color='gray.400' /> : <ViewOffIcon color='gray.400' />}
              </Button>
            </InputRightElement>
          </InputGroup>
          {/* {errors.password && <FormErrorMessage>This field is required</FormErrorMessage>} */}
        </FormControl>
        <Button
          {...(isSubmitting ? { isLoading: true } : {})}
          type='submit'
          variant='solid'
          colorScheme='teal'
          size='sm'
        >
          Login
        </Button>
      </Stack>
    </form>
  )
}

export default LoginForm
