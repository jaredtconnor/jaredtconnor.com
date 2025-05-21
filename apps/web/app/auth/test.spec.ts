import { render } from '@testing-library/react';
import  from './';

describe('', () => {
  it('renders correctly', () => {
    const { container } = render(<>Test</>);
    expect(container).toMatchSnapshot();
  });
});
