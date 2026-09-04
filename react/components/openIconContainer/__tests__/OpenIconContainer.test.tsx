import React from 'react'
import { render } from '@vtex/test-tools/react'

import OpenIconContainer from '../OpenIconContainer'

jest.mock('vtex.css-handles', () => ({
  useCssHandles: () => ({
    handles: { openIconContainer: 'test-openIconContainer' },
  }),
}))

describe('OpenIconContainer', () => {
  it('does not mark the wrapper as aria-hidden or presentation', () => {
    const { container } = render(
      <OpenIconContainer onClick={jest.fn()}>
        <button type="button">Open minicart</button>
      </OpenIconContainer>
    )

    const wrapper = container.firstChild as HTMLElement

    expect(wrapper).not.toHaveAttribute('aria-hidden')
    expect(wrapper).not.toHaveAttribute('role', 'presentation')
    expect(wrapper).not.toHaveAttribute('tabIndex')
  })

  it('keeps focusable children reachable for keyboard users', () => {
    const { getByRole } = render(
      <OpenIconContainer onClick={jest.fn()}>
        <button type="button">Open minicart</button>
      </OpenIconContainer>
    )

    const button = getByRole('button', { name: 'Open minicart' })

    expect(button).not.toHaveAttribute('aria-hidden')
    button.focus()
    expect(document.activeElement).toBe(button)
  })

  it('applies the openIconContainer CSS handle and pointer styling', () => {
    const { container } = render(
      <OpenIconContainer onClick={jest.fn()}>
        <span>icon</span>
      </OpenIconContainer>
    )

    const wrapper = container.firstChild as HTMLElement

    expect(wrapper.className).toContain('test-openIconContainer')
    expect(wrapper.className).toContain('pa4')
    expect(wrapper.className).toContain('pointer')
  })

  it('forwards click events to open the drawer', () => {
    const onClick = jest.fn()

    const { container } = render(
      <OpenIconContainer onClick={onClick}>
        <span>icon</span>
      </OpenIconContainer>
    )

    const wrapper = container.firstChild as HTMLElement
    wrapper.click()

    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
