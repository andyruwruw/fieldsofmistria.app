// Packages
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

/**
 * Result of a {@link useAsyncAction} call.
 */
export interface UseAsyncActionResult<TArgs extends unknown[], TResult> {
  /**
   * Invoke the action. Resolves to the action's return value on success,
   * or `null` if the action threw (the error is surfaced via `error`).
   *
   * @param {...TArgs} args - Arguments forwarded to the underlying action.
   * @returns {Promise<TResult | null>} The result, or `null` on failure.
   */
  execute: (...args: TArgs) => Promise<TResult | null>;

  /**
   * Whether the action is currently running.
   */
  loading: boolean;

  /**
   * The error thrown by the most recent invocation, or `null`.
   */
  error: Error | null;

  /**
   * Clears `error` back to `null` (e.g. when the user dismisses an error banner).
   */
  reset: () => void,
}

/**
 * Wraps an async mutation (save upload, delete, etc.) with loading and error
 * state tracking.
 *
 * Replaces the common pattern of a `useState` "saving" flag plus a try/catch
 * block around an API call. Unmount-safe: state updates after the component
 * unmounts are suppressed, and late results from stale invocations are
 * discarded so only the newest call's outcome is reflected.
 *
 * @template TArgs
 * @template TResult
 * @param {(...args: TArgs) => Promise<TResult>} action - The async operation to run.
 * @returns {UseAsyncActionResult<TArgs, TResult>} Execute function and status.
 */
export function useAsyncAction<
  TArgs extends unknown[],
  TResult,
>(action: (...args: TArgs) => Promise<TResult>): UseAsyncActionResult<TArgs, TResult> {
  const [
    loading,
    setLoading,
  ] = useState<boolean>(false);
  const [
    error,
    setError,
  ] = useState<Error | null>(null);

  const _actionRef = useRef(action);
  _actionRef.current = action;

  const _callId = useRef(0);
  const _mounted = useRef(true);

  useEffect(
    (): () => void => {
      _mounted.current = true;

      return (): void => {
        _mounted.current = false;
      };
    },
    [],
  );

  const execute = useCallback(
    async (...args: TArgs): Promise<TResult | null> => {
      const current = ++_callId.current;
      setLoading(true);
      setError(null);

      try {
        const result = await _actionRef.current(...args);
        if (_mounted.current && current === _callId.current) {
          setLoading(false);
        }
        return result;
      } catch (err) {
        if (_mounted.current && current === _callId.current) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setLoading(false);
        }
        return null;
      }
    },
    [
      setError,
      setLoading,
      _actionRef,
      _callId,
      _mounted,
    ],
  );

  const reset = useCallback(
    (): void => setError(null),
    [setError],
  );

  return {
    execute,
    loading,
    error,
    reset,
  };
}

export default useAsyncAction;
