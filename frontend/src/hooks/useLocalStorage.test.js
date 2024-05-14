import { renderHook, act } from '@testing-library/react-hooks';
import useLocalStorage from './useLocalStorage';

test('should use local storage', () => {
    const { result } = renderHook(() => useLocalStorage('testKey', 'initialValue'));

    expect(result.current[0]).toBe('initialValue');

    act(() => {
        result.current[1]('newValue');
    });

    expect(result.current[0]).toBe('newValue');
    expect(window.localStorage.getItem('testKey')).toBe('newValue'); 
});
