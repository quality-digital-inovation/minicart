import React from 'react'
import { render, fireEvent } from '@vtex/test-tools/react'

import MinicartIconButton from '../MinicartIconButton'
import {
  MinicartContextProvider,
  useMinicartState,
} from '../../MinicartContext'

jest.mock('vtex.order-manager/OrderForm', () => ({
  useOrderForm: () => ({
    orderForm: { items: [] },
    loading: false,
  }),
}))

jest.mock('vtex.checkout-resources/Utils', () => ({
  useCheckoutURL: () => ({ url: '/checkout' }),
}))

jest.mock('../../modules/checkoutHook', () => () => jest.fn())

jest.mock('../CssHandlesContext', () => ({
  useMinicartCssHandles: () => ({
    handles: {
      minicartIconContainer: 'minicartIconContainer',
      minicartQuantityBadge: 'minicartQuantityBadge',
    },
  }),
}))

const Icon = () => <span data-testid="cart-icon">cart</span>

const OpenStateProbe = () => {
  const { open } = useMinicartState()

  return <span data-testid="open-state">{open ? 'open' : 'closed'}</span>
}

describe('<MinicartIconButton />', () => {
  it('should render a native button with a non-empty aria-label', () => {
    const { getByRole } = render(
      <MinicartContextProvider variation="drawer">
        <MinicartIconButton
          Icon={Icon}
          itemCountMode="distinct"
          quantityDisplay="not-empty"
        />
      </MinicartContextProvider>
    )

    const button = getByRole('button', { name: /open minicart/i })

    expect(button.tagName).toBe('BUTTON')
    expect(button).toHaveAttribute('type', 'button')
    expect(button.getAttribute('aria-label')).not.toBe('')
  })

  it('should open the minicart when clicked', () => {
    const { getByRole, getByTestId } = render(
      <MinicartContextProvider variation="drawer">
        <MinicartIconButton
          Icon={Icon}
          itemCountMode="distinct"
          quantityDisplay="not-empty"
        />
        <OpenStateProbe />
      </MinicartContextProvider>
    )

    expect(getByTestId('open-state')).toHaveTextContent('closed')

    fireEvent.click(getByRole('button', { name: /open minicart/i }))

    expect(getByTestId('open-state')).toHaveTextContent('open')
  })
})
