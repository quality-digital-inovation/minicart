import React from 'react'
import { render, fireEvent } from '@vtex/test-tools/react'

import MinicartIconButton from '../MinicartIconButton'

const mockDispatch = jest.fn()

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
    },
  }),
}))

jest.mock('../../MinicartContext', () => ({
  useMinicartState: jest.fn(() => ({
    open: false,
    openBehavior: 'click',
    openOnHoverProp: false,
  })),
  useMinicartDispatch: () => mockDispatch,
}))

const { useMinicartState } = jest.requireMock('../../MinicartContext')

const Icon = () => <span data-testid="cart-icon">icon</span>

const messages = {
  'store/minicart.open-button-label': 'Open minicart',
}

const defaultProps = {
  Icon,
  quantityDisplay: 'not-empty' as QuantityDisplayType,
  itemCountMode: 'distinct' as MinicartTotalItemsType,
}

describe('MinicartIconButton', () => {
  beforeEach(() => {
    mockDispatch.mockClear()
    useMinicartState.mockReturnValue({
      open: false,
      openBehavior: 'click',
      openOnHoverProp: false,
    })
  })

  it('should render a native button with a non-empty aria-label', () => {
    const { getByRole } = render(
      <MinicartIconButton {...defaultProps} />,
      { locale: 'en', messages }
    )

    const button = getByRole('button', { name: 'Open minicart' })

    expect(button.tagName).toBe('BUTTON')
    expect(button.getAttribute('type')).toBe('button')
    expect(button.getAttribute('aria-label')).toBeTruthy()
    expect(button.getAttribute('aria-label')).toBe('Open minicart')
  })

  it('should open the minicart when clicked while closed', () => {
    const { getByRole } = render(
      <MinicartIconButton {...defaultProps} />,
      { locale: 'en', messages }
    )

    fireEvent.click(getByRole('button', { name: 'Open minicart' }))

    expect(mockDispatch).toHaveBeenCalledWith({ type: 'OPEN_MINICART' })
  })

  it('should close the minicart when clicked while open', () => {
    useMinicartState.mockReturnValue({
      open: true,
      openBehavior: 'click',
      openOnHoverProp: false,
    })

    const { getByRole } = render(
      <MinicartIconButton {...defaultProps} />,
      { locale: 'en', messages }
    )

    fireEvent.click(getByRole('button', { name: 'Open minicart' }))

    expect(mockDispatch).toHaveBeenCalledWith({ type: 'CLOSE_MINICART' })
  })
})
