import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../redux/store';

export function useTypedDispatch(): AppDispatch {
    return useDispatch<AppDispatch>();
}

export function useTypedSelector(): TypedUseSelectorHook<RootState> {
    return useSelector;
}
