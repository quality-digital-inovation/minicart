import React from 'react'
import { render, fireEvent } from '@vtex/test-tools/react'

jest.mock('../components/CssHandlesContext', () => ({
  useMinicartCssHandles: () => ({
    handles: {
      minicartIconContainer: 'minicartIconContainer',
      minicartQuantityBadge: 'minicartQuantityBadge',
    },
  }),
  MinicartCssHandlesProvider: ({
    children,
  }: {
    children: React.ReactNode
  }) => <>{children}</>,
}))

import MinicartIconButton from '../components/MinicartIconButton'
import {
  MinicartContextProvider,
  useMinicartState,
} from '../MinicartContext'
import { MinicartCssHandlesProvider } from '../components/CssHandlesContext'

const MockIcon = () => <span data-testid="cart-icon">cart</span>

jest.mock('vtex.order-manager/OrderForm', () => ({
  useOrderForm: () => ({
    orderForm: { items: [] },
    loading: false,
  }),
}))

jest.mock('vtex.checkout-resources/Utils', () => ({
  useCheckoutURL: () => ({ url: '/checkout' }),
}))

jest.mock('../modules/checkoutHook', () => ({
  __esModule: true,
  default: () => jest.fn(),
}))

const OpenState: React.FC = () => {
  const { open } = useMinicartState()

  return <span data-testid="open-state">{open ? 'open' : 'closed'}</span>
}

const renderMinicartIconButton = () =>
  render(
    <MinicartContextProvider>
      <MinicartCssHandlesProvider handles={{}} withModifiers={() => ''}>
        <OpenState />
        <MinicartIconButton
          Icon={MockIcon}
          quantityDisplay="not-empty"
          itemCountMode="distinct"
        />
      </MinicartCssHandlesProvider>
    </MinicartContextProvider>
  )

describe('<MinicartIconButton />', () => {
  it('renders a native button with a non-empty aria-label', () => {
    const { getByRole } = renderMinicartIconButton()
    const button = getByRole('button', { name: 'Open minicart' })

    expect(button.tagName).toBe('BUTTON')
    expect(button).toHaveAttribute('type', 'button')
    expect(button.getAttribute('aria-label')).toBeTruthy()
  })

  it('opens and closes the minicart when clicked', () => {
    const { getByRole, getByTestId } = renderMinicartIconButton()
    const button = getByRole('button', { name: 'Open minicart' })

    expect(getByTestId('open-state')).toHaveTextContent('closed')

    fireEvent.click(button)
    expect(getByTestId('open-state')).toHaveTextContent('open')

    fireEvent.click(button)
    expect(getByTestId('open-state')).toHaveTextContent('closed')
  })
})
