#  CUBE
#  Copyright (C) 2025-2026  scidsgn
#  This program is free software: you can redistribute it and/or modify
#  it under the terms of the GNU Affero General Public License as published
#  by the Free Software Foundation, either version 3 of the License, or
#  (at your option) any later version.
#  This program is distributed in the hope that it will be useful,
#  but WITHOUT ANY WARRANTY; without even the implied warranty of
#  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#  GNU Affero General Public License for more details.
#  You should have received a copy of the GNU Affero General Public License
#  along with this program.  If not, see <https://www.gnu.org/licenses/>.
from dataclasses import dataclass
from typing import Callable

import music_tag
from music_tag import AudioFile
from pydantic.v1 import BaseModel

from src.metadata.extract_features import extract_features
from src.metadata.extract_settings import ExtractMetadataSettings
from src.metadata.metadata_model import (
    MetadataAlbum,
    MetadataDisc,
    MetadataTrack,
    MetadataArtist,
)
from src.metadata.parse_track_number import parse_track_number
from src.metadata.parse_track_year import parse_track_year
from src.metadata.split_artists import split_artists
from src.scanning.scans.tracks_import_job.tracks_import_errors import TrackMetadataFailDetails


def extract_metadata_from_file(file_path: str, settings: ExtractMetadataSettings):
    try:
        music_file = music_tag.load_file(file_path)

        # TODO this method of handling errors is properly ugly
        try:
            title_features = extract_features(music_file["tracktitle"].first, settings)
            artist_features = extract_features(music_file["artist"].first, settings)

            album_title = music_file["album"].first
            album_artists = music_file["albumartist"].first
            disc_number = music_file["discnumber"].first
            track_number = get_track_number(music_file)
            release_year = get_track_year(music_file)

            album = (
                MetadataAlbum(
                    title=album_title,
                    artists=artists_from_list(split_artists(album_artists, settings)),
                    artwork=music_file["artwork"].first
                    if music_file["artwork"]
                    else None,
                    release_year=release_year
                )
                if album_title and album_artists
                else None
            )

            disc = (
                MetadataDisc(album=album, disc_number=disc_number if disc_number else 1)
                if album
                else None
            )

            return MetadataTrack(
                file_path=file_path,
                duration=music_file["#length"].first,
                title=title_features.actual_value,
                release_year=release_year,
                artists=artists_from_list(
                    split_artists(artist_features.actual_value, settings)
                ),
                features=artists_from_list(
                    title_features.features + artist_features.features
                ),
                remixers=artists_from_list(
                    title_features.remixers + artist_features.remixers
                ),
                disc=disc,
                track_number=track_number,
                artwork=music_file["artwork"].first if music_file["artwork"] else None,
            )
        except ValueError as e:
            return TrackMetadataFailDetails(
                reason=str(e),
                raw_tags=get_all_tags_for_debug(music_file),
            )

    except NotImplementedError:
        pass


def get_all_tags_for_debug(music_file: AudioFile) -> dict[str, list[str]]:
    tag_map = music_file.tag_map
    tag_keys = [
        key for key in tag_map.keys() if not key.startswith("#") and key != "artwork"
    ]

    return {key: music_file.get(key, typeless=True).values for key in tag_keys}


def get_track_number(music_file: AudioFile):
    raw_track_number = music_file.get("tracknumber", typeless=True)
    if raw_track_number is None:
        return None
    if raw_track_number.first is None:
        return None

    return parse_track_number(raw_track_number.first.strip())

def get_track_year(music_file: AudioFile):
    raw_year = music_file.get("year", typeless=True)
    if raw_year is None:
        return None
    if raw_year.first is None:
        return None

    return parse_track_year(raw_year.first.strip())


def artists_from_list(artists: list[str]):
    return [MetadataArtist(artist) for artist in unique(artists)]


def unique[T](items: list[T]):
    return list(dict.fromkeys(items))
