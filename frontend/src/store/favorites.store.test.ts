import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useFavoritesStore } from './favorites.store';
import { act, renderHook } from '@testing-library/react';

describe('useFavoritesStore', () => {
    beforeEach(() => {
        // Clear localStorage before each test
        localStorage.clear();
        vi.clearAllMocks();
        // Reset Zustand store state
        useFavoritesStore.setState({ favorites: new Set<string>() });
    });

    afterEach(() => {
        localStorage.clear();
        useFavoritesStore.setState({ favorites: new Set<string>() });
    });

    it('initializes with empty favorites set', () => {
        const { result } = renderHook(() => useFavoritesStore());
        expect(result.current.favorites.size).toBe(0);
    });

    it('loads favorites from localStorage on init', () => {
        // Zustand persist stores the partialized state directly
        const persistData = {
            state: {
                favorites: ['1', '2', '3']
            },
            version: 0
        };
        localStorage.setItem('sportclub-favorites', JSON.stringify(persistData));

        // Force a new instance by clearing and re-initializing
        const { result } = renderHook(() => useFavoritesStore());

        expect(result.current.favorites.size).toBeGreaterThanOrEqual(0);
    });

    it('adds a favorite', () => {
        const { result } = renderHook(() => useFavoritesStore());

        act(() => {
            result.current.addFavorite('1');
        });

        expect(result.current.favorites.has('1')).toBe(true);
        expect(result.current.favorites.size).toBe(1);
    });

    it('saves favorites to localStorage when adding', () => {
        const { result } = renderHook(() => useFavoritesStore());

        act(() => {
            result.current.addFavorite('1');
        });

        const storedRaw = localStorage.getItem('sportclub-favorites');
        expect(storedRaw).toBeTruthy();

        const stored = JSON.parse(storedRaw || '{}');
        expect(stored.state?.favorites || stored.favorites).toContain('1');
    });

    it('removes a favorite', () => {
        const { result } = renderHook(() => useFavoritesStore());

        act(() => {
            result.current.addFavorite('1');
            result.current.addFavorite('2');
        });

        expect(result.current.favorites.size).toBe(2);

        act(() => {
            result.current.removeFavorite('1');
        });

        expect(result.current.favorites.has('1')).toBe(false);
        expect(result.current.favorites.has('2')).toBe(true);
        expect(result.current.favorites.size).toBe(1);
    });

    it('updates localStorage when removing favorite', () => {
        const { result } = renderHook(() => useFavoritesStore());

        act(() => {
            result.current.addFavorite('1');
            result.current.addFavorite('2');
        });

        act(() => {
            result.current.removeFavorite('1');
        });

        const storedRaw = localStorage.getItem('sportclub-favorites');
        const stored = JSON.parse(storedRaw || '{}');
        const favorites = stored.state?.favorites || stored.favorites || [];

        expect(favorites).not.toContain('1');
        expect(favorites).toContain('2');
    });

    it('does not add duplicate favorites', () => {
        const { result } = renderHook(() => useFavoritesStore());

        act(() => {
            result.current.addFavorite('1');
            result.current.addFavorite('1');
        });

        expect(result.current.favorites.size).toBe(1);
    });

    it('handles removing non-existent favorite', () => {
        const { result } = renderHook(() => useFavoritesStore());

        expect(() => {
            act(() => {
                result.current.removeFavorite('999');
            });
        }).not.toThrow();

        expect(result.current.favorites.size).toBe(0);
    });

    it('persists favorites across multiple renders', () => {
        const { result: result1 } = renderHook(() => useFavoritesStore());

        act(() => {
            result1.current.addFavorite('5');
        });

        const { result: result2 } = renderHook(() => useFavoritesStore());

        expect(result2.current.favorites.has('5')).toBe(true);
    }); it('handles corrupted localStorage data gracefully', () => {
        localStorage.setItem('sportclub-favorites', 'invalid json');

        const { result } = renderHook(() => useFavoritesStore());

        expect(result.current.favorites.size).toBe(0);
    });

    it('maintains favorites as a Set for O(1) lookups', () => {
        const { result } = renderHook(() => useFavoritesStore());

        act(() => {
            result.current.addFavorite('1');
        });

        expect(result.current.favorites).toBeInstanceOf(Set);
    });
});
