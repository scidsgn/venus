#  CUBE
#  Copyright (C) 2025  scidsgn
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
import re

from src.metadata.metadata_model import MetadataTrackNumber


def handle_number_with_suffix(match: re.Match[str]):
    return MetadataTrackNumber(order=int(match.group(1)), suffix=match.group(2).strip())

def handle_number(match: re.Match[str]):
    return MetadataTrackNumber(order=int(match.group(1)), suffix="")

# TODO: this might need extra logic for handling funky tags
track_number_patterns = [
    (
        re.compile(r'^(\d+)([^\d]+)$'), handle_number_with_suffix
    ),
    (
        re.compile(r'^(\d+)$'), handle_number
    ),
]

def parse_track_number(track_number: str) -> MetadataTrackNumber | None:
    for pattern, handler in track_number_patterns:
        match = re.match(pattern, track_number)
        if match:
            return handler(match)

    return None
