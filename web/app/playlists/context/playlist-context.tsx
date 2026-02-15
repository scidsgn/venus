/*
 * CUBE
 * Copyright (C) 2025-2026  scidsgn
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

"use client"

import { PlaylistDto } from "@/apis/venus"
import { createContext, ReactNode, useContext, useMemo } from "react"
import useSWR from "swr"
import { fetchPlaylistsAction } from "@/app/playlists/context/fetch-playlists-action"
import { actionFailed } from "@/app/action/action"

type PlaylistContextValue = {
    playlists: PlaylistDto[]
    refreshPlaylists: () => void
}

const PlaylistContext = createContext<PlaylistContextValue | null>({
    playlists: [],
    refreshPlaylists: () => {},
})

export const PlaylistContextProvider = ({
    children,
}: {
    children?: ReactNode
}) => {
    const { data, mutate } = useSWR(
        { type: "venus-playlists" },
        fetchPlaylistsAction,
    )

    const contextValue = useMemo(
        () => ({
            playlists:
                (data && !actionFailed(data) && data.data.playlists) || [],
            refreshPlaylists: () => mutate(),
        }),
        [data, mutate],
    )

    return (
        <PlaylistContext.Provider value={contextValue}>
            {children}
        </PlaylistContext.Provider>
    )
}

export function usePlaylistContext() {
    const context = useContext(PlaylistContext)
    if (!context) {
        throw new Error("usePlaylistContext must be used within the context")
    }

    return context
}
