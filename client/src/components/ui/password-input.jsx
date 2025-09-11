'use client'

import {
  Box,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  useControllableState,
} from '@chakra-ui/react';
import { useMergeRefs } from '@chakra-ui/hooks'; 
import * as React from 'react'
import { LuEye, LuEyeOff } from 'react-icons/lu'

export const PasswordInput = React.forwardRef(
  function PasswordInput(props, ref) {
    const {
      rootProps,
      defaultVisible,
      visible: visibleProp,
      onVisibleChange,
      visibilityIcon = { on: <LuEye />, off: <LuEyeOff /> },
      ...rest
    } = props

    const [visible, setVisible] = useControllableState({
      value: visibleProp,
      defaultValue: defaultVisible || false,
      onChange: onVisibleChange,
    })

    const inputRef = React.useRef(null)
    const mergedRefs = useMergeRefs(ref, inputRef) 

    return (
      <InputGroup {...rootProps}>
        <Input
          {...rest}
          ref={mergedRefs}
          type={visible ? 'text' : 'password'}
        />
        <InputRightElement>
          <VisibilityTrigger
            disabled={rest.disabled}
            onClick={() => {
              if (rest.disabled) return
              setVisible(!visible)
            }}
          >
            {visible ? visibilityIcon.off : visibilityIcon.on}
          </VisibilityTrigger>
        </InputRightElement>
      </InputGroup>
    )
  },
)

const VisibilityTrigger = React.forwardRef(
  function VisibilityTrigger(props, ref) {
    return (
      <IconButton
        tabIndex={-1}
        ref={ref}
        mr='-2'
        size='sm'
        variant='ghost'
        height='calc(100% - 8px)'
        aria-label='Toggle password visibility'
        {...props}
      />
    )
  },
)

export const PasswordStrengthMeter = React.forwardRef(
  function PasswordStrengthMeter(props, ref) {
    const { max = 4, value, ...rest } = props

    const percent = (value / max) * 100
    const { label, color } = getColorPalette(percent) 

    return (
      <Stack align='flex-end' gap='1' ref={ref} {...rest}>
        <HStack width='full' {...rest}>
          {Array.from({ length: max }).map((_, index) => (
            <Box
              key={index}
              height='1'
              flex='1'
              rounded='sm'
              bg={index < value ? color : 'gray.200'} 
            />
          ))}
        </HStack>
        {label && <HStack textStyle='xs'>{label}</HStack>}
      </Stack>
    )
  },
)

function getColorPalette(percent) {
  switch (true) {
    case percent < 33:
      return { label: 'Low', color: 'red.500' }
    case percent < 66:
      return { label: 'Medium', color: 'orange.500' }
    default:
      return { label: 'High', color: 'green.500' }
  }
}