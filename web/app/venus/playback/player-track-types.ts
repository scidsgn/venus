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

import {
    ArtistWithNameDto,
    CoverArtDto,
    TrackDto,
    TrackMusicalFeaturesDto,
} from "@/apis/venus"

export type PlayerTrackAlbum = {
    id: number
    title: string
    discNumber: number
    trackCount: number
    trackNumber: number
    trackNumberSuffix: string
}

export type PlayerTrackMusicalFeatures = {
    bpm: number
    key: string
    scale: string
    camelotIndex: number
}

export type PlayerTrack = {
    id: number
    title: string
    duration: number
    artists: ArtistWithNameDto[]
    features: ArtistWithNameDto[]
    remixers: ArtistWithNameDto[]
    artwork?: CoverArtDto
    album?: PlayerTrackAlbum
    musicalFeatures?: PlayerTrackMusicalFeatures
}

export function trackDtoToPlayerTrack(track: TrackDto): PlayerTrack {
    const album = () => {
        if (!track.disc_track) {
            return undefined
        }

        return {
            id: track.disc_track.disc.album.id,
            title: track.disc_track.disc.album.title,
            discNumber: track.disc_track.disc.disc_number,
            trackCount: track.disc_track.disc.track_count,
            trackNumber: track.disc_track.track_number,
            trackNumberSuffix: track.disc_track.track_number_suffix,
        }
    }

    return {
        ...track,
        artwork: track.artwork || undefined,
        album: album(),
        musicalFeatures: trackMusicalFeaturesDtoToPlayerModel(
            track.musical_features,
        ),
    }
}

export function trackMusicalFeaturesDtoToPlayerModel(
    musicalFeatures: TrackMusicalFeaturesDto | null | undefined,
): PlayerTrackMusicalFeatures | undefined {
    if (!musicalFeatures) {
        return undefined
    }

    return {
        ...musicalFeatures,
        camelotIndex: musicalFeatures.camelot_index,
    }
}
