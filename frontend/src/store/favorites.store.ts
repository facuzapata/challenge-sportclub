import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface FavoritesState {
    favorites: Set<string>;
    addFavorite: (id: string) => void;
    removeFavorite: (id: string) => void;
    isFavorite: (id: string) => boolean;
    toggleFavorite: (id: string) => void;
}

export const useFavoritesStore = create<FavoritesState>()(
    persist(
        (set, get) => ({
            favorites: new Set<string>(),

            addFavorite: (id: string) =>
                set((state) => ({
                    favorites: new Set(state.favorites).add(id),
                })),

            removeFavorite: (id: string) =>
                set((state) => {
                    const newFavorites = new Set(state.favorites);
                    newFavorites.delete(id);
                    return { favorites: newFavorites };
                }),

            isFavorite: (id: string) => get().favorites.has(id),

            toggleFavorite: (id: string) => {
                const { isFavorite, addFavorite, removeFavorite } = get();
                if (isFavorite(id)) {
                    removeFavorite(id);
                } else {
                    addFavorite(id);
                }
            },
        }),
        {
            name: 'sportclub-favorites',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                favorites: Array.from(state.favorites),
            }),
            merge: (persistedState: any, currentState) => ({
                ...currentState,
                favorites: new Set(persistedState?.favorites || []),
            }),
        }
    )
);
