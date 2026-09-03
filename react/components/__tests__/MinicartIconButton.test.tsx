import React from 'react'
import { render, fireEvent } from '@vtex/test-tools/react'

import MinicartIconButton from '../MinicartIconButton'

const MockIcon = () => <span data-testid="cart-icon">cart</span>

const mockDispatch = jest.fn()

const mockState = {
  variation: 'drawer' as const,
  open: false,
  hasBeenOpened: false,
  openBehavior: 'click' as const,
  openOnHoverProp: false,
}

jest.mock('vtex.order-manager/OrderForm', () => ({
  useOrderForm: () => ({
    orderForm: { items: [] },
    loading: false,
  }),
}))

jest.mock('vtex.checkout-resources/Utils', () => ({
  useCheckoutURL: () => ({ url: '/checkout' }),
}))

jest.mock('../../modules/checkoutHook', () => ({
  __esModule: true,
  default: () => jest.fn(),
}))

jest.mock('../CssHandlesContext', () => ({
  useMinicartCssHandles: () => ({
    handles: {
      minicartIconContainer: 'minicartIconContainer',
      minicartQuantityBadge: 'minicartQuantityBadge',
      minicartIconButton: 'minicartIconButton',
    },
  }),
}))

jest.mock('../../MinicartContext', () => ({
  useMinicartState: jest.fn(() => mockState),
  useMinicartDispatch: jest.fn(() => mockDispatch),
}))

const { useMinicartState } = jest.requireMock('../../MinicartContext')

const renderButton = () =>
  render(
    <MinicartIconButton
      Icon={MockIcon}
      itemCountMode="distinct"
      quantityDisplay="not-empty"
    />
  )

describe('<MinicartIconButton />', () => {
  beforeEach(() => {
    mockDispatch.mockClear()
    useMinicartState.mockReturnValue(mockState)
  })

  it('renders a native button with a non-empty aria-label', () => {
    const { getByRole } = renderButton()

    const button = getByRole('button', { name: /open minicart/i })

    expect(button.tagName).toBe('BUTTON')
    expect(button).toHaveAttribute('type', 'button')
    expect(button.getAttribute('aria-label')).toBeTruthy()
  })

  it('opens the minicart when clicked while closed', () => {
    const { getByRole } = renderButton()

    fireEvent.click(getByRole('button', { name: /open minicart/i }))

    expect(mockDispatch).toHaveBeenCalledWith({ type: 'OPEN_MINICART' })
  })

  it('closes the minicart when clicked while open', () => {
    useMinicartState.mockReturnValue({ ...mockState, open: true })

    const { getByRole } = renderButton()

    fireEvent.click(getByRole('button', { name: /open minicart/i }))

    expect(mockDispatch).toHaveBeenCalledWith({ type: 'CLOSE_MINICART' })
  })
})
