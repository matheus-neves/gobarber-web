import { renderHook, act } from '@testing-library/react-hooks';
import { useToast, ToastProvider } from '../../hooks/toast';

const mockedUUID = jest.fn(() => '5b0a5f0a-36f5-4d0e-aff8-d4865daeacf5');

jest.mock('uuidv4', () => {
  return {
    uuid: () => mockedUUID(),
  };
});

describe('Toast hook', () => {
  it('should be able show/hide toast', async () => {
    const { result } = renderHook(() => useToast(), {
      wrapper: ToastProvider,
    });

    act(() => {
      result.current.addToast({
        type: 'info',
        title: 'test title',
        description: 'test description',
      });
    });

    expect(result.current.messages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'info',
          title: 'test title',
          description: 'test description',
        }),
      ]),
    );

    act(() => {
      result.current.removeToast(mockedUUID());
    });

    expect(result.current.messages).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'info',
          title: 'test title',
          description: 'test description',
        }),
      ]),
    );
  });
});
