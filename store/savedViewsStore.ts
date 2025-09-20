import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SavedView } from '../types';

interface SavedViewsState {
    savedViews: SavedView[];
    addView: (view: SavedView) => void;
    removeView: (viewId: string) => void;
}

export const useSavedViewsStore = create<SavedViewsState>()(
    persist(
        (set) => ({
            savedViews: [],
            addView: (view) => set((state) => ({ savedViews: [...state.savedViews, view] })),
            removeView: (viewId) => set((state) => ({
                savedViews: state.savedViews.filter((v) => v.id !== viewId),
            })),
        }),
        {
            name: 'sge-user-saved-views', // name of the item in the storage (must be unique)
        }
    )
);