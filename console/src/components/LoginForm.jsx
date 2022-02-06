import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Stack, Input, Button, Icon, FormControl, InputGroup, InputLeftElement, InputRightElement, FormErrorMessage } from '@chakra-ui/react';

import { FiUser,FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

import { useForm } from 'react-hook-form';
import axios from 'axios';

import useAuth from '../stores/auth';
import { useToastMessage } from '../hooks';


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
              children={<Icon as={FiUser} color='gray.500' />}
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
              children={<Icon as={FiLock} color='gray.500' />}
            />
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder='Password'
              {...register('password', { required: true })}
            />
            <InputRightElement width='2.5rem'>
              <Button size='xs' onClick={handlePasswordVisibility}>
                {showPassword ? <Icon as={FiEye} color='gray.500' /> : <Icon as={FiEyeOff} color='gray.500' />}
              </Button>
            </InputRightElement>
          </InputGroup>
          {/* {errors.password && <FormErrorMessage>This field is required</FormErrorMessage>} */}
        </FormControl>
        <Button
          isLoading={isSubmitting}
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
};

export default LoginForm;
