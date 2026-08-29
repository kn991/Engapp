import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AnswerInput } from '@/components/train/answer-input'

describe('AnswerInput', () => {
  it('turns off the corrections that would answer the question for you', () => {
    render(<AnswerInput value="" onChange={() => {}} review={false} />)
    const input = screen.getByLabelText('Your answer in English')
    expect(input).toHaveAttribute('autocorrect', 'off')
    expect(input).toHaveAttribute('autocapitalize', 'none')
    expect(input).toHaveAttribute('autocomplete', 'off')
    expect(input).toHaveAttribute('spellcheck', 'false')
  })

  it('reports every keystroke while answering', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<AnswerInput value="" onChange={onChange} review={false} />)

    await user.type(screen.getByLabelText('Your answer in English'), 'a')
    expect(onChange).toHaveBeenCalledWith('a')
  })

  it('ignores edits during review but stays a focusable input', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<AnswerInput value="avoid" onChange={onChange} review />)

    const input = screen.getByLabelText('Your answer in English')
    expect(input).toHaveAttribute('aria-readonly', 'true')
    expect(input).not.toBeDisabled()

    await user.type(input, 'x')
    expect(onChange).not.toHaveBeenCalled()
  })

  it('submits the surrounding form when Enter is pressed', async () => {
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault())
    const user = userEvent.setup()
    render(
      <form onSubmit={onSubmit}>
        <AnswerInput value="avoid" onChange={() => {}} review={false} />
      </form>
    )

    await user.click(screen.getByLabelText('Your answer in English'))
    await user.keyboard('{Enter}')
    expect(onSubmit).toHaveBeenCalledTimes(1)
  })

  it('offers the microphone only when the session supports it', () => {
    const { rerender } = render(
      <AnswerInput value="" onChange={() => {}} review={false} micSupported={false} />
    )
    expect(screen.queryByLabelText('Answer by voice')).toBeNull()

    rerender(<AnswerInput value="" onChange={() => {}} review={false} micSupported />)
    expect(screen.getByLabelText('Answer by voice')).toBeInTheDocument()
  })
})
