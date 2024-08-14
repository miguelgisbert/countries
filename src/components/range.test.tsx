// import { render } from '@testing-library/react'
// import { describe, expect, test } from '@jest/globals'
// import Range from './range'

// describe('Range Component', () => {
//   test('renders correctly', () => {
//     const { getByTestId } = render(<Range min={0} max={100} />)
//     const rangeElement = getByTestId('range')
//     // expect(rangeElement).toBeInTheDocument()
//   })

//   test('initializes with the correct integer min and max values', () => {
//     const { getByTestId } = render(<Range min={0} max={100} />)
//     const minValueText = getByTestId('min-value-text')
//     const maxValueText = getByTestId('max-value-text')
//     expect(minValueText.textContent).toBe('0.00 €')
//     expect(maxValueText.textContent).toBe('100.00 €')
//   })

//   test('initializes with the correct float min and max values', () => {
//     const { getByTestId } = render(<Range min={5.99} max={79.99} />)
//     const minValueText = getByTestId('min-value-text')
//     const maxValueText = getByTestId('max-value-text')
//     expect(minValueText.textContent).toBe('5.99 €')
//     expect(maxValueText.textContent).toBe('79.99 €')
//   })

//   test('generates correct number of selectable divs with correct left position', () => {
//     const selectableValues = [5.99, 30.99, 70.99]
//     const { container } = render(<Range min={0} max={100} />)
    
//     const divs = container.querySelectorAll('div[data-testid="selectable-value"]')
//     expect(divs.length).toBe(selectableValues.length)
  
//     selectableValues.forEach((value, index) => {
//       const expectedLeftPosition = Math.round(((value - 0) / (100 - 0)) * 100)
//       expect((divs[index] as HTMLElement).style.left).toBe(`${expectedLeftPosition}%`)
//     })
//   })
// })
