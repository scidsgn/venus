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

import { Button } from "@/app/components/button/button"
import { PlayerTrack } from "@/app/venus/playback/player-track-types"
import { usePlaybackQueue } from "@/app/venus/playback/playback-queue-store"

type TracklistSelectionBarProps = {
    tracks: PlayerTrack[]
    selectedTrackIds: number[]
    setSelectedTrackIds: (ids: number[]) => void
}

export const TracklistSelectionBar = ({
    tracks,
    selectedTrackIds,
    setSelectedTrackIds,
}: TracklistSelectionBarProps) => {
    const playTracks = usePlaybackQueue((state) => state.playTracks)
    const enqueue = usePlaybackQueue((state) => state.enqueue)

    return (
        <div className="bg-accent-700 sticky bottom-6 z-1 -mx-[2px] flex items-center gap-1 border-2 border-gray-950 p-1 shadow-lg shadow-gray-950">
            <div className="tracking-sm grow px-2 text-sm font-medium">
                {selectedTrackIds.length} selected
            </div>

            <Button
                variant="transparent"
                icon="select_all"
                onClick={() =>
                    setSelectedTrackIds(tracks.map((track) => track.id))
                }
            >
                Select all
            </Button>
            <Button
                variant="transparent"
                icon="deselect"
                onClick={() => setSelectedTrackIds([])}
            >
                Deselect all
            </Button>

            <div className="h-4 w-px bg-gray-50/30" />

            <Button
                variant="transparent"
                icon="play_arrow"
                fill
                onClick={() => {
                    const selectedTracks = tracks.filter((track) =>
                        selectedTrackIds.includes(track.id),
                    )

                    playTracks(selectedTracks, selectedTracks[0])
                    setSelectedTrackIds([])
                }}
            >
                Play
            </Button>
            <Button
                variant="transparent"
                icon="playlist_add"
                onClick={() => {
                    enqueue(
                        tracks.filter((track) =>
                            selectedTrackIds.includes(track.id),
                        ),
                    )
                    setSelectedTrackIds([])
                }}
            >
                Add to queue
            </Button>
        </div>
    )
}
