/*
 * CUBE
 * Copyright (C) 2026  scidsgn
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

import { PlayerTrack } from "@/app/playback/player-track-types"
import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useState,
} from "react"
import { TracklistSelectionBar } from "@/app/components/tracklist/tracklist-selection-bar"

type SelectTrackOptions = {
    ctrlKey: boolean
    shiftKey: boolean
}

type TracklistContextValue = {
    tracks: PlayerTrack[]
    selectedTrackIds: number[]

    selectTrack: (track: PlayerTrack, options: SelectTrackOptions) => void
    clearTrackSelection: () => void
    setTrackSelection: (track: PlayerTrack, selected: boolean) => void
}

const TracklistContext = createContext<TracklistContextValue>({
    tracks: [],
    selectedTrackIds: [],

    selectTrack: () => {},
    clearTrackSelection: () => {},
    setTrackSelection: () => {},
})

type TracklistProviderProps = {
    children?: ReactNode
    tracks: PlayerTrack[]
}

export const TracklistProvider = ({
    children,
    tracks,
}: TracklistProviderProps) => {
    const [selectedTrackIds, setSelectedTrackIds] = useState<number[]>([])

    const selectTrack = useCallback(
        (track: PlayerTrack, options: SelectTrackOptions) => {
            // TODO: support for shift-select
            if (options.ctrlKey) {
                setSelectedTrackIds((tracks) => {
                    const alreadySelected = tracks.includes(track.id)

                    if (alreadySelected) {
                        return tracks.filter((id) => id !== track.id)
                    } else {
                        return [...tracks, track.id]
                    }
                })
            } else {
                setSelectedTrackIds([track.id])
            }
        },
        [],
    )

    const clearTrackSelection = useCallback(() => {
        setSelectedTrackIds([])
    }, [])

    const setTrackSelection = useCallback(
        (track: PlayerTrack, selected: boolean) => {
            if (selected) {
                setSelectedTrackIds((tracks) => [...tracks, track.id])
            } else {
                setSelectedTrackIds((tracks) =>
                    tracks.filter((id) => id !== track.id),
                )
            }
        },
        [],
    )

    return (
        <TracklistContext
            value={{
                tracks,
                selectedTrackIds,
                selectTrack,
                clearTrackSelection,
                setTrackSelection,
            }}
        >
            {children}

            {selectedTrackIds.length > 0 && (
                <TracklistSelectionBar
                    tracks={tracks}
                    selectedTrackIds={selectedTrackIds}
                    setSelectedTrackIds={setSelectedTrackIds}
                />
            )}
        </TracklistContext>
    )
}

export function useTracklist() {
    return useContext(TracklistContext)
}
